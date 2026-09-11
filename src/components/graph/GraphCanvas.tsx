import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Link2,
  Crosshair,
  Layers,
  Sparkles,
  Share2,
  Eye,
  Filter,
  Plus,
  Network as NetIcon,
} from 'lucide-react';
import {
  Category,
  GraphLink,
  GraphNode,
  GraphSettings,
  LayoutMode,
  Network,
  Website,
} from '../../types';
import { CATEGORY_COLORS } from '../../services/catalog';

interface GraphCanvasProps {
  websites: Website[];
  activeNetworkId: string;
  activeNetwork?: Network;
  searchQuery: string;
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  onOpenWebsite: (website: Website) => void;
  onContextMenu: (e: React.MouseEvent, node: GraphNode) => void;
  onConnectNodes: (sourceId: string, targetId: string) => void;
  onOpenAddWebsiteInNetwork?: (networkId: string) => void;
  settings: GraphSettings;
  className?: string;
}

interface Particle {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
  color: string;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  websites,
  activeNetworkId,
  activeNetwork,
  searchQuery,
  selectedNodeId,
  onSelectNode,
  onOpenWebsite,
  onContextMenu,
  onConnectNodes,
  onOpenAddWebsiteInNetwork,
  settings,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Transform state (Pan & Zoom)
  const transformRef = useRef({ x: 0, y: 0, scale: 0.95 });
  const [zoomLevel, setZoomLevel] = useState(95);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [physicsRunning, setPhysicsRunning] = useState(settings.physicsEnabled);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(settings.defaultLayout);
  const [connectSourceNode, setConnectSourceNode] = useState<GraphNode | null>(null);
  const [isConnectMode, setIsConnectMode] = useState(false);

  // Graph Simulation State
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Interaction refs
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const dragNodeRef = useRef<GraphNode | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const hoveredNodeRef = useRef<GraphNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Filtered websites by network
  const visibleWebsites = React.useMemo(() => {
    if (activeNetworkId === 'net-all') return websites;
    return websites.filter((w) => w.networkId === activeNetworkId);
  }, [websites, activeNetworkId]);

  // Load and cache favicon image
  const getFaviconImage = useCallback((url: string): HTMLImageElement | null => {
    if (!url) return null;
    const cache = imageCacheRef.current;
    if (cache.has(url)) {
      return cache.get(url)!;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    cache.set(url, img);
    return img;
  }, []);

  // Initialize or update graph nodes and links
  const initializeGraph = useCallback(() => {
    const existingNodeMap = new Map<string, GraphNode>();
    nodesRef.current.forEach((n) => existingNodeMap.set(n.id, n));

    const newNodes: GraphNode[] = [];
    const newLinks: GraphLink[] = [];
    const categoriesPresent = new Set<Category>();

    // 1. Collect categories
    visibleWebsites.forEach((w) => {
      categoriesPresent.add(w.category);
    });

    const width = canvasRef.current?.width || 1200;
    const height = canvasRef.current?.height || 800;
    const centerX = width / 2;
    const centerY = height / 2;

    // 2. Build Category Hub Nodes
    if (settings.showCategories) {
      const categoryArray = Array.from(categoriesPresent);
      categoryArray.forEach((cat, idx) => {
        const catId = `cat-${cat}`;
        const existing = existingNodeMap.get(catId);
        const count = visibleWebsites.filter((w) => w.category === cat).length;
        const angle = (idx / categoryArray.length) * Math.PI * 2;
        const radiusDist = Math.min(width, height) * 0.28;

        newNodes.push({
          id: catId,
          type: 'category',
          label: cat.toUpperCase(),
          subLabel: `${count} NODES`,
          x: existing?.x ?? centerX + Math.cos(angle) * radiusDist + (Math.random() - 0.5) * 40,
          y: existing?.y ?? centerY + Math.sin(angle) * radiusDist + (Math.random() - 0.5) * 40,
          vx: existing?.vx ?? 0,
          vy: existing?.vy ?? 0,
          radius: (settings.nodeSize * 1.5) + Math.min(count * 1.2, 10),
          color: CATEGORY_COLORS[cat] || '#ef4444',
          data: { category: cat, count },
          pinned: existing?.pinned,
        });
      });
    }

    // 3. Build Website Nodes & Links
    visibleWebsites.forEach((site) => {
      const existing = existingNodeMap.get(site.id);
      const catColor = CATEGORY_COLORS[site.category] || '#ef4444';
      const catNode = newNodes.find((n) => n.id === `cat-${site.category}`);

      let initX = existing?.x;
      let initY = existing?.y;

      if (initX === undefined || initY === undefined) {
        if (catNode) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 100;
          initX = catNode.x + Math.cos(angle) * dist;
          initY = catNode.y + Math.sin(angle) * dist;
        } else {
          initX = centerX + (Math.random() - 0.5) * 400;
          initY = centerY + (Math.random() - 0.5) * 400;
        }
      }

      newNodes.push({
        id: site.id,
        type: 'website',
        label: site.name,
        subLabel: site.domain,
        x: initX,
        y: initY,
        vx: existing?.vx ?? 0,
        vy: existing?.vy ?? 0,
        radius: site.isFavorite ? settings.nodeSize * 1.2 : settings.nodeSize,
        color: catColor,
        data: site,
        pinned: existing?.pinned,
      });

      // Link to Category Hub
      if (settings.showCategories && settings.autoConnections) {
        newLinks.push({
          id: `link-${site.id}-cat-${site.category}`,
          source: site.id,
          target: `cat-${site.category}`,
          type: 'category',
          strength: 0.8,
        });
      }

      // Custom Connections
      if (site.customConnections && Array.isArray(site.customConnections)) {
        site.customConnections.forEach((targetId) => {
          if (visibleWebsites.some((w) => w.id === targetId)) {
            newLinks.push({
              id: `custom-${site.id}-${targetId}`,
              source: site.id,
              target: targetId,
              type: 'custom',
              strength: 1.0,
            });
          }
        });
      }
    });

    // Auto-discover tag / subcategory relationship links for web spider effect
    if (settings.autoConnections) {
      for (let i = 0; i < visibleWebsites.length; i++) {
        for (let j = i + 1; j < visibleWebsites.length; j++) {
          const a = visibleWebsites[i];
          const b = visibleWebsites[j];
          // Share subcategory or at least 2 common tags
          const commonTags = a.tags.filter((t) => b.tags.includes(t));
          if (a.subcategory && a.subcategory === b.subcategory && a.category === b.category) {
            newLinks.push({
              id: `rel-sub-${a.id}-${b.id}`,
              source: a.id,
              target: b.id,
              type: 'related',
              strength: 0.5,
            });
          } else if (commonTags.length >= 2) {
            newLinks.push({
              id: `rel-tag-${a.id}-${b.id}`,
              source: a.id,
              target: b.id,
              type: 'tag',
              strength: 0.3,
            });
          }
        }
      }
    }

    nodesRef.current = newNodes;
    linksRef.current = newLinks;

    // Seed interactive traveling particles for spider web
    const particles: Particle[] = [];
    if (settings.spiderWebParticles) {
      newLinks.slice(0, 30).forEach((link) => {
        particles.push({
          sourceId: link.source,
          targetId: link.target,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          color: link.type === 'category' ? '#ef4444' : '#f43f5e',
        });
      });
    }
    particlesRef.current = particles;
  }, [visibleWebsites, settings]);

  useEffect(() => {
    initializeGraph();
  }, [initializeGraph]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Set initial pan to center
      if (transformRef.current.x === 0 && transformRef.current.y === 0) {
        transformRef.current.x = (rect.width * dpr) / 2;
        transformRef.current.y = (rect.height * dpr) / 2;
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Force-Directed Layout Simulation Tick
  const simulatePhysics = useCallback(() => {
    if (!physicsRunning) return;

    const nodes = nodesRef.current;
    const links = linksRef.current;
    const dpr = window.devicePixelRatio || 1;
    const width = (canvasRef.current?.width || 1200) / dpr;
    const height = (canvasRef.current?.height || 800) / dpr;

    const nodeMap = new Map<string, GraphNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const damping = 0.88;
    const repulsionStrength = 1800 * settings.forceDensity;
    const centerGravity = 0.015;

    // 1. Center Gravity
    nodes.forEach((n) => {
      if (n.pinned) return;
      const dx = 0 - n.x;
      const dy = 0 - n.y;
      n.vx += dx * centerGravity;
      n.vy += dy * centerGravity;
    });

    // 2. Repulsion between all nodes (Coulomb's Law)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const minDist = a.radius + b.radius + 20;

        if (dist < 400) {
          const force = (repulsionStrength / (dist * dist + 100)) * (dist < minDist ? 2.5 : 1.0);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!a.pinned) {
            a.vx -= fx;
            a.vy -= fy;
          }
          if (!b.pinned) {
            b.vx += fx;
            b.vy += fy;
          }
        }
      }
    }

    // 3. Link Spring Attraction (Hooke's Law)
    links.forEach((link) => {
      const src = nodeMap.get(link.source);
      const tgt = nodeMap.get(link.target);
      if (!src || !tgt) return;

      const dx = tgt.x - src.x;
      const dy = tgt.y - src.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const idealDist = link.type === 'category' ? 110 : 80;
      const spring = (dist - idealDist) * 0.04 * (link.strength || 1);

      const fx = (dx / dist) * spring;
      const fy = (dy / dist) * spring;

      if (!src.pinned) {
        src.vx += fx;
        src.vy += fy;
      }
      if (!tgt.pinned) {
        tgt.vx -= fx;
        tgt.vy -= fy;
      }
    });

    // 4. Integrate velocities & update positions
    nodes.forEach((n) => {
      if (n.pinned) return;
      n.vx *= damping;
      n.vy *= damping;

      // Cap speed
      const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed > 14) {
        n.vx = (n.vx / speed) * 14;
        n.vy = (n.vy / speed) * 14;
      }

      n.x += n.vx;
      n.y += n.vy;
    });
  }, [physicsRunning, settings]);

  // Layout Algorithms
  const applyLayout = useCallback(
    (mode: LayoutMode) => {
      setLayoutMode(mode);
      const nodes = nodesRef.current;
      const categories = nodes.filter((n) => n.type === 'category');
      const websites = nodes.filter((n) => n.type === 'website');

      if (mode === 'radial') {
        // Radial Spider Web
        const catRadius = 180;
        categories.forEach((cat, idx) => {
          const angle = (idx / categories.length) * Math.PI * 2;
          cat.x = Math.cos(angle) * catRadius;
          cat.y = Math.sin(angle) * catRadius;
          cat.vx = 0;
          cat.vy = 0;

          // Orbit children around this category
          const children = websites.filter(
            (w) => (w.data as Website).category === (cat.data as any).category
          );
          children.forEach((child, cIdx) => {
            const childAngle = angle - 0.4 + (cIdx / Math.max(children.length, 1)) * 0.8;
            const dist = catRadius + 120 + (cIdx % 2) * 45;
            child.x = Math.cos(childAngle) * dist;
            child.y = Math.sin(childAngle) * dist;
            child.vx = 0;
            child.vy = 0;
          });
        });
      } else if (mode === 'hierarchical') {
        // Hierarchical Tree
        const colWidth = 240;
        categories.forEach((cat, colIdx) => {
          const x = (colIdx - (categories.length - 1) / 2) * colWidth;
          cat.x = x;
          cat.y = -200;
          cat.vx = 0;
          cat.vy = 0;

          const children = websites.filter(
            (w) => (w.data as Website).category === (cat.data as any).category
          );
          children.forEach((child, rowIdx) => {
            child.x = x + ((rowIdx % 2 === 0 ? -1 : 1) * 45);
            child.y = -80 + rowIdx * 65;
            child.vx = 0;
            child.vy = 0;
          });
        });
      } else {
        // Force-Directed Kickstart
        nodes.forEach((n) => {
          n.vx = (Math.random() - 0.5) * 20;
          n.vy = (Math.random() - 0.5) * 20;
        });
        setPhysicsRunning(true);
      }
    },
    []
  );

  // Main Render Loop
  useEffect(() => {
    let isCancelled = false;

    const render = () => {
      if (isCancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width;
      const height = canvas.height;

      // Tick physics
      simulatePhysics();

      // Clear Canvas with sleek Cyber Dark background
      ctx.save();
      ctx.fillStyle = '#09090b'; // Deep Dark
      ctx.fillRect(0, 0, width, height);

      // Draw subtle cyber dot matrix
      const { x: panX, y: panY, scale } = transformRef.current;
      ctx.translate(panX, panY);
      ctx.scale(scale, scale);

      // Grid Dots
      const gridSize = 40;
      const viewLeft = -panX / scale;
      const viewTop = -panY / scale;
      const viewRight = (width - panX) / scale;
      const viewBottom = (height - panY) / scale;

      const startX = Math.floor(viewLeft / gridSize) * gridSize;
      const startY = Math.floor(viewTop / gridSize) * gridSize;

      ctx.fillStyle = '#1e1e24';
      for (let x = startX; x < viewRight; x += gridSize) {
        for (let y = startY; y < viewBottom; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const nodes = nodesRef.current;
      const links = linksRef.current;
      const nodeMap = new Map<string, GraphNode>();
      nodes.forEach((n) => nodeMap.set(n.id, n));

      const hoveredNode = hoveredNodeRef.current;
      const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) : null;

      // Connected neighbors set for focus highlight
      const activeHighlightSet = new Set<string>();
      if (hoveredNode) {
        activeHighlightSet.add(hoveredNode.id);
        links.forEach((l) => {
          if (l.source === hoveredNode.id) activeHighlightSet.add(l.target);
          if (l.target === hoveredNode.id) activeHighlightSet.add(l.source);
        });
      } else if (selectedNode) {
        activeHighlightSet.add(selectedNode.id);
        links.forEach((l) => {
          if (l.source === selectedNode.id) activeHighlightSet.add(l.target);
          if (l.target === selectedNode.id) activeHighlightSet.add(l.source);
        });
      }

      // Search match set
      const searchMatchSet = new Set<string>();
      const hasSearch = searchQuery.trim().length > 0;
      if (hasSearch) {
        const q = searchQuery.toLowerCase();
        nodes.forEach((n) => {
          if (n.label.toLowerCase().includes(q)) searchMatchSet.add(n.id);
          if (n.subLabel && n.subLabel.toLowerCase().includes(q)) searchMatchSet.add(n.id);
          if (n.type === 'website') {
            const site = n.data as Website;
            if (site.tags?.some((t) => t.toLowerCase().includes(q))) searchMatchSet.add(n.id);
            if (site.description?.toLowerCase().includes(q)) searchMatchSet.add(n.id);
          }
        });
      }

      // 1. Draw Spider Web Edges (Filaments)
      links.forEach((link) => {
        const src = nodeMap.get(link.source);
        const tgt = nodeMap.get(link.target);
        if (!src || !tgt) return;

        const isHighlighted =
          activeHighlightSet.size > 0 &&
          activeHighlightSet.has(src.id) &&
          activeHighlightSet.has(tgt.id);

        const isDimmed = activeHighlightSet.size > 0 && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#ef4444'; // Cyber Red Glow
          ctx.lineWidth = settings.connectionThickness * 2.2;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
        } else if (link.type === 'custom') {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = settings.connectionThickness * 1.5;
          ctx.setLineDash([4, 4]);
        } else if (link.type === 'category') {
          ctx.strokeStyle = isDimmed ? 'rgba(55, 55, 65, 0.2)' : 'rgba(100, 100, 115, 0.35)';
          ctx.lineWidth = settings.connectionThickness;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = isDimmed ? 'rgba(40, 40, 50, 0.15)' : 'rgba(80, 80, 95, 0.22)';
          ctx.lineWidth = settings.connectionThickness * 0.8;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
      });

      // 2. Draw Traveling Energetic Particles along Links
      if (settings.spiderWebParticles) {
        particlesRef.current.forEach((p) => {
          const src = nodeMap.get(p.sourceId);
          const tgt = nodeMap.get(p.targetId);
          if (!src || !tgt) return;

          p.progress += p.speed;
          if (p.progress > 1) p.progress = 0;

          const px = src.x + (tgt.x - src.x) * p.progress;
          const py = src.y + (tgt.y - src.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // 3. Draw Connecting Line preview if in connect mode
      if (connectSourceNode) {
        const mouseX = (mousePosRef.current.x - panX) / scale;
        const mouseY = (mousePosRef.current.y - panY) / scale;
        ctx.beginPath();
        ctx.moveTo(connectSourceNode.x, connectSourceNode.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 4. Draw Nodes
      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNodeId === node.id;
        const isConnectedNeighbor = activeHighlightSet.has(node.id);
        const isDimmed = activeHighlightSet.size > 0 && !isConnectedNeighbor;
        const isSearchMatch = hasSearch && searchMatchSet.has(node.id);

        ctx.save();
        ctx.translate(node.x, node.y);

        const alpha = isDimmed ? 0.22 : 1.0;
        ctx.globalAlpha = alpha;

        // Selection / Hover Glow Ring
        if (isSelected || isHovered || isSearchMatch) {
          ctx.beginPath();
          ctx.arc(0, 0, node.radius + (isSelected ? 9 : 6), 0, Math.PI * 2);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = isSelected ? 3 : 2;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = isSelected ? 18 : 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Category Hub Node vs Website Node
        if (node.type === 'category') {
          // Category Hub Design
          ctx.beginPath();
          ctx.arc(0, 0, node.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `${node.color}55`;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#121217';
          ctx.fill();
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Hub Inner Icon / Badge
          ctx.beginPath();
          ctx.arc(0, 0, node.radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();

          // Category Label
          if (settings.showLabels || isHovered || isSelected) {
            ctx.font = 'bold 12px monospace';
            ctx.fillStyle = '#f4f4f7';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, 0, node.radius + 16);

            if (node.subLabel) {
              ctx.font = '9px monospace';
              ctx.fillStyle = '#8f90a2';
              ctx.fillText(node.subLabel, 0, node.radius + 28);
            }
          }
        } else {
          // Website Node Design
          const site = node.data as Website;

          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#18181f';
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#ef4444' : `${node.color}aa`;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Draw Favicon or initial letter
          const img = getFaviconImage(site.favicon);
          const iconSize = node.radius * 1.1;
          if (img && img.complete && img.naturalWidth !== 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, node.radius - 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
            ctx.restore();
          } else {
            // Initial letter
            ctx.font = 'bold 11px sans-serif';
            ctx.fillStyle = '#f4f4f7';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label.charAt(0).toUpperCase(), 0, 0);
          }

          // Favorite badge (star indicator)
          if (site.isFavorite) {
            ctx.beginPath();
            ctx.arc(node.radius * 0.7, -node.radius * 0.7, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = '#eab308';
            ctx.fill();
            ctx.strokeStyle = '#09090b';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          // Labels
          if (settings.showLabels || isHovered || isSelected || isConnectedNeighbor) {
            ctx.font = '500 11px system-ui, sans-serif';
            ctx.fillStyle = isSelected || isHovered ? '#ffffff' : '#d4d4dc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(node.label, 0, node.radius + 6);

            // Domain sublabel on hover/select
            if ((isHovered || isSelected) && node.subLabel) {
              ctx.font = '9px monospace';
              ctx.fillStyle = '#9494a5';
              ctx.fillText(node.subLabel, 0, node.radius + 20);
            }
          }
        }

        ctx.restore();
      });

      ctx.restore(); // Restore pan/zoom translation

      // Continue loop
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      isCancelled = true;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [
    simulatePhysics,
    settings,
    selectedNodeId,
    searchQuery,
    connectSourceNode,
    getFaviconImage,
  ]);

  // Find node at canvas coordinates
  const getNodeAtCoords = useCallback((screenX: number, screenY: number): GraphNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { x: panX, y: panY, scale } = transformRef.current;

    const worldX = (screenX - panX) / scale;
    const worldY = (screenY - panY) / scale;

    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= node.radius + 6) {
        return node;
      }
    }
    return null;
  }, []);

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2) return; // Right click handled by onContextMenu
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    lastMousePosRef.current = { x: mouseX, y: mouseY };
    const hitNode = getNodeAtCoords(mouseX, mouseY);

    if (hitNode) {
      if (isConnectMode) {
        if (!connectSourceNode) {
          setConnectSourceNode(hitNode);
        } else if (connectSourceNode.id !== hitNode.id) {
          onConnectNodes(connectSourceNode.id, hitNode.id);
          setConnectSourceNode(null);
          setIsConnectMode(false);
        }
        return;
      }

      dragNodeRef.current = hitNode;
      isDraggingRef.current = true;
      hitNode.pinned = true;
      onSelectNode(hitNode);
    } else {
      isPanningRef.current = true;
      setConnectSourceNode(null);
      if (!isConnectMode) {
        onSelectNode(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    mousePosRef.current = { x: mouseX, y: mouseY };

    if (isDraggingRef.current && dragNodeRef.current) {
      const { scale } = transformRef.current;
      const dx = (mouseX - lastMousePosRef.current.x) / scale;
      const dy = (mouseY - lastMousePosRef.current.y) / scale;
      dragNodeRef.current.x += dx;
      dragNodeRef.current.y += dy;
      dragNodeRef.current.vx = 0;
      dragNodeRef.current.vy = 0;
    } else if (isPanningRef.current) {
      const dx = mouseX - lastMousePosRef.current.x;
      const dy = mouseY - lastMousePosRef.current.y;
      transformRef.current.x += dx;
      transformRef.current.y += dy;
    } else {
      // Check hover
      const hitNode = getNodeAtCoords(mouseX, mouseY);
      hoveredNodeRef.current = hitNode;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = hitNode
          ? isConnectMode
            ? 'crosshair'
            : 'pointer'
          : isPanningRef.current
          ? 'grabbing'
          : 'grab';
      }
    }

    lastMousePosRef.current = { x: mouseX, y: mouseY };
  };

  const handleMouseUp = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.pinned = false;
      dragNodeRef.current = null;
    }
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  // Zoom via wheel
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newScale = Math.min(Math.max(transformRef.current.scale * zoomFactor, 0.25), 3.0);

    // Zoom centered on mouse
    transformRef.current.x = mouseX - (mouseX - transformRef.current.x) * (newScale / transformRef.current.scale);
    transformRef.current.y = mouseY - (mouseY - transformRef.current.y) * (newScale / transformRef.current.scale);
    transformRef.current.scale = newScale;

    setZoomLevel(Math.round(newScale * 100));
  };

  // Double Click opens website directly!
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const hitNode = getNodeAtCoords(e.clientX - rect.left, e.clientY - rect.top);
    if (hitNode && hitNode.type === 'website') {
      onOpenWebsite(hitNode.data as Website);
    }
  };

  // Right Click Context Menu
  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const hitNode = getNodeAtCoords(e.clientX - rect.left, e.clientY - rect.top);
    if (hitNode) {
      onContextMenu(e, hitNode);
    }
  };

  // Zoom Buttons
  const handleZoom = (delta: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
    const centerY = canvas.height / (2 * (window.devicePixelRatio || 1));
    const newScale = Math.min(Math.max(transformRef.current.scale * delta, 0.25), 3.0);

    transformRef.current.x = centerX - (centerX - transformRef.current.x) * (newScale / transformRef.current.scale);
    transformRef.current.y = centerY - (centerY - transformRef.current.y) * (newScale / transformRef.current.scale);
    transformRef.current.scale = newScale;
    setZoomLevel(Math.round(newScale * 100));
  };

  // Reset / Center View
  const handleCenter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    transformRef.current.x = canvas.width / (2 * dpr);
    transformRef.current.y = canvas.height / (2 * dpr);
    transformRef.current.scale = 0.95;
    setZoomLevel(95);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="visual-network-container"
      className={`relative w-full h-full overflow-hidden bg-[#09090b] select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        id="obsidian-graph-canvas"
        className="w-full h-full block touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      />

      {/* Top Left HUD Info */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-[#121217]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#272732] shadow-xl">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-white tracking-wider">
            {nodesRef.current.length} NODES
          </span>
          <span className="text-zinc-600 font-mono">•</span>
          <span className="text-xs font-mono text-zinc-400">
            {linksRef.current.length} EDGES
          </span>
          <span className="text-zinc-600 font-mono">•</span>
          <span className="text-xs font-mono text-red-400 capitalize">
            {layoutMode} WEB
          </span>
        </div>
      </div>

      {/* Top Right Controls Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[#121217]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#272732] shadow-2xl">
        <button
          id="graph-zoom-in"
          onClick={() => handleZoom(1.2)}
          title="Zoom In"
          className="p-2 text-zinc-400 hover:text-white hover:bg-[#1f1f2a] rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="graph-zoom-out"
          onClick={() => handleZoom(0.83)}
          title="Zoom Out"
          className="p-2 text-zinc-400 hover:text-white hover:bg-[#1f1f2a] rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-zinc-400 px-1">{zoomLevel}%</span>
        <div className="w-[1px] h-4 bg-[#272732] mx-1" />

        <button
          id="graph-center"
          onClick={handleCenter}
          title="Center Graph"
          className="p-2 text-zinc-400 hover:text-white hover:bg-[#1f1f2a] rounded-lg transition-colors"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <button
          id="graph-connect-mode"
          onClick={() => {
            setIsConnectMode(!isConnectMode);
            setConnectSourceNode(null);
          }}
          title={isConnectMode ? 'Exit Connect Mode' : 'Link Nodes Interactively'}
          className={`p-2 rounded-lg transition-colors ${
            isConnectMode
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-[#1f1f2a]'
          }`}
        >
          <Link2 className="w-4 h-4" />
        </button>

        <button
          id="graph-physics-toggle"
          onClick={() => setPhysicsRunning(!physicsRunning)}
          title={physicsRunning ? 'Pause Physics' : 'Resume Physics'}
          className={`p-2 rounded-lg transition-colors ${
            physicsRunning
              ? 'text-red-400 hover:bg-[#1f1f2a]'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {physicsRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="w-[1px] h-4 bg-[#272732] mx-1" />

        {/* Layout Switcher */}
        <button
          id="graph-layout-toggle"
          onClick={() => {
            const nextMode: LayoutMode =
              layoutMode === 'force' ? 'radial' : layoutMode === 'radial' ? 'hierarchical' : 'force';
            applyLayout(nextMode);
          }}
          title={`Current Layout: ${layoutMode}. Click to cycle.`}
          className="p-2 text-zinc-400 hover:text-white hover:bg-[#1f1f2a] rounded-lg transition-colors flex items-center gap-1 text-xs"
        >
          <Layers className="w-4 h-4 text-red-400" />
        </button>

        <button
          id="graph-fullscreen"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2 text-zinc-400 hover:text-white hover:bg-[#1f1f2a] rounded-lg transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Connect Mode Banner */}
      {isConnectMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-red-950/90 text-red-200 border border-red-800/80 px-4 py-2 rounded-lg backdrop-blur-md shadow-2xl flex items-center gap-3 text-xs animate-bounce">
          <Link2 className="w-4 h-4 text-red-400" />
          <span>
            {connectSourceNode
              ? `Select second node to connect with "${connectSourceNode.label}"`
              : 'Click on a source node to begin linking'}
          </span>
          <button
            onClick={() => {
              setIsConnectMode(false);
              setConnectSourceNode(null);
            }}
            className="text-zinc-400 hover:text-white font-mono ml-2 underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Bottom Left Quick Help Pill */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-[11px] text-zinc-500 bg-[#121217]/80 backdrop-blur px-3 py-1.5 rounded-lg border border-[#272732]/60">
        <span>Click to inspect</span>
        <span>•</span>
        <span>Double-click to open</span>
        <span>•</span>
        <span>Right-click for options</span>
        <span>•</span>
        <span>Drag to pan</span>
      </div>

      {/* Interactive Empty State for Network with 0 websites */}
      {visibleWebsites.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 pointer-events-none">
          <div className="pointer-events-auto max-w-md w-full bg-[#121219]/95 border border-[#2e2e42] rounded-2xl p-6 text-center backdrop-blur-xl shadow-2xl space-y-4">
            <div
              className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border shadow-lg"
              style={{
                backgroundColor: `${activeNetwork?.color || '#ef4444'}20`,
                borderColor: `${activeNetwork?.color || '#ef4444'}50`,
                color: activeNetwork?.color || '#ef4444',
              }}
            >
              <NetIcon className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                شبكة {activeNetwork?.name || 'الجديدة'} جاهزة لاستقبال العقد
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                لم تقم بإضافة أو ربط أي موقع في هذه الشبكة بعد. اسحب أي رابط أو ملف اختصار وأفلته في أي مكان، أو انقر بالأسفل لإضافة أول موقع ليظهر فوراً في الشبكة المرئية!
              </p>
            </div>

            <div className="pt-1 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAddWebsiteInNetwork?.(activeNetworkId)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة أول موقع في هذه الشبكة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
