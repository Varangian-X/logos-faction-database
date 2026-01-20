import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Eye, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InteractiveGlobe({ 
  locations = [], 
  discoveredLocations = [], 
  currentLocation,
  onLocationSelect 
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeRef = useRef(null);
  const markersRef = useRef([]);
  const animationRef = useRef(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Point light (for glow effect)
    const pointLight = new THREE.PointLight(0x4dd4ff, 1, 100);
    pointLight.position.set(-5, 0, 0);
    scene.add(pointLight);

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Create custom material with grid pattern
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0f172a) },
        color2: { value: new THREE.Color(0x1e293b) },
        glowColor: { value: new THREE.Color(0x06b6d4) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Grid pattern
          float gridX = abs(sin(vPosition.y * 20.0));
          float gridY = abs(sin(vPosition.x * 20.0 + vPosition.z * 20.0));
          float grid = step(0.95, max(gridX, gridY));
          
          // Fresnel glow
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          
          // Animated pulse
          float pulse = sin(time * 2.0) * 0.3 + 0.7;
          
          // Mix colors
          vec3 baseColor = mix(color1, color2, vPosition.y * 0.5 + 0.5);
          vec3 finalColor = mix(baseColor, glowColor, grid * 0.3);
          finalColor += glowColor * fresnel * 0.4 * pulse;
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
      transparent: true
    });

    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    globeRef.current = globe;

    // Outer glow atmosphere
    const glowGeometry = new THREE.SphereGeometry(1.1, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x06b6d4) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor, intensity * 0.5);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    // Add location markers
    const addMarkers = () => {
      // Clear existing markers
      markersRef.current.forEach(marker => scene.remove(marker));
      markersRef.current = [];

      locations.forEach(location => {
        const isDiscovered = discoveredLocations.includes(location.id);
        const isCurrent = currentLocation === location.id;
        
        if (!isDiscovered && !isCurrent) return;

        // Convert coordinates to 3D position on sphere
        const phi = (90 - (location.coordinates?.latitude || 0)) * (Math.PI / 180);
        const theta = (location.coordinates?.longitude || 0 + 180) * (Math.PI / 180);
        
        const x = 1.02 * Math.sin(phi) * Math.cos(theta);
        const y = 1.02 * Math.cos(phi);
        const z = 1.02 * Math.sin(phi) * Math.sin(theta);

        // Create marker
        const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: isCurrent ? 0xfbbf24 : 0x06b6d4,
          emissive: isCurrent ? 0xfbbf24 : 0x06b6d4,
          emissiveIntensity: 1
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, y, z);
        marker.userData = { location };
        
        // Add pulsing ring for current location
        if (isCurrent) {
          const ringGeometry = new THREE.RingGeometry(0.03, 0.04, 32);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xfbbf24,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.position.set(x, y, z);
          ring.lookAt(0, 0, 0);
          scene.add(ring);
          markersRef.current.push(ring);
        }
        
        scene.add(marker);
        markersRef.current.push(marker);

        // Add label sprite (small glow)
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, isCurrent ? 'rgba(251, 191, 36, 0.8)' : 'rgba(6, 182, 212, 0.6)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(x, y, z);
        sprite.scale.set(0.15, 0.15, 1);
        scene.add(sprite);
        markersRef.current.push(sprite);
      });
    };

    addMarkers();

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = event.clientX - mouseRef.current.x;
        const deltaY = event.clientY - mouseRef.current.y;
        
        globe.rotation.y += deltaX * 0.005;
        globe.rotation.x += deltaY * 0.005;
        globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, globe.rotation.x));
        
        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;
      } else {
        // Check for marker hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markersRef.current.filter(m => m.userData.location));
        
        if (intersects.length > 0) {
          setHoveredLocation(intersects[0].object.userData.location);
          document.body.style.cursor = 'pointer';
        } else {
          setHoveredLocation(null);
          document.body.style.cursor = 'default';
        }
      }
    };

    const onMouseDown = (event) => {
      isDraggingRef.current = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = () => {
      if (hoveredLocation && !isDraggingRef.current) {
        setSelectedLocation(hoveredLocation);
        if (onLocationSelect) {
          onLocationSelect(hoveredLocation);
        }
      }
    };

    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('mousedown', onMouseDown);
    mountRef.current.addEventListener('mouseup', onMouseUp);
    mountRef.current.addEventListener('click', onClick);

    // Animation loop
    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.01;
      
      // Update shader time
      globeMaterial.uniforms.time.value = time;
      
      // Slow auto-rotation when not dragging
      if (!isDraggingRef.current) {
        globe.rotation.y += 0.001;
      }

      // Pulse markers
      markersRef.current.forEach((marker, index) => {
        if (marker.userData.location) {
          const scale = 1 + Math.sin(time * 3 + index) * 0.3;
          marker.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', onMouseMove);
        mountRef.current.removeEventListener('mousedown', onMouseDown);
        mountRef.current.removeEventListener('mouseup', onMouseUp);
        mountRef.current.removeEventListener('click', onClick);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [locations, discoveredLocations, currentLocation]);

  return (
    <Card className="bg-slate-900/80 border-cyan-900/30 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-cyan-400 uppercase tracking-wider text-sm flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Imperial Navigation Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* 3D Globe Canvas */}
          <div 
            ref={mountRef} 
            className="w-full h-[500px] bg-gradient-to-b from-slate-950 to-slate-900"
          />
          
          {/* Hover Info Overlay */}
          {hoveredLocation && (
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-cyan-200">{hoveredLocation.name}</h4>
              </div>
              <p className="text-xs text-gray-400 mb-2">{hoveredLocation.sector}</p>
              {hoveredLocation.coordinates && (
                <div className="text-[10px] text-gray-500">
                  Lat: {hoveredLocation.coordinates.latitude}° | 
                  Long: {hoveredLocation.coordinates.longitude}°
                </div>
              )}
              <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 text-[9px]">
                Click to view details
              </Badge>
            </div>
          )}
          
          {/* Selected Location Panel */}
          {selectedLocation && (
            <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4 max-w-sm shadow-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-base font-bold text-cyan-200">{selectedLocation.name}</h4>
                  <p className="text-xs text-gray-400">{selectedLocation.sector}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedLocation(null)}
                  className="h-6 w-6 text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              
              <p className="text-xs text-gray-300 mb-3">
                {selectedLocation.description}
              </p>
              
              {selectedLocation.faction_control && (
                <div className="mb-2">
                  <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/50">
                    Controlled by: {selectedLocation.faction_control}
                  </Badge>
                </div>
              )}
              
              {currentLocation !== selectedLocation.id && onLocationSelect && (
                <Button
                  size="sm"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-xs"
                  onClick={() => onLocationSelect(selectedLocation)}
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Set as Destination
                </Button>
              )}
            </div>
          )}
          
          {/* Controls Help */}
          <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-sm rounded-lg px-3 py-2 text-[10px] text-gray-400">
            <Eye className="w-3 h-3 inline mr-1" />
            Drag to rotate • Click markers to select
          </div>
          
          {/* Legend */}
          <div className="absolute top-4 right-4 bg-slate-900/70 backdrop-blur-sm rounded-lg p-3 space-y-1 text-[10px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <span className="text-gray-400">Current Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-gray-400">Discovered</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}