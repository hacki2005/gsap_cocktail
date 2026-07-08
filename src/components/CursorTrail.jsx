import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const colors = [
  "#e7d393",
  "#ff6b9d",
  "#6bcaff",
  "#c77dff",
  "#4ecb71",
  "#ffa62b",
];

const shapes = [
  // blob
  (color, i) => (
    <svg key={i} width="60" height="60" viewBox="0 0 60 60">
      <path
        d="M30 5 C45 5 55 15 55 30 C55 45 45 55 30 55 C15 55 5 45 5 30 C5 15 15 5 30 5 Z"
        fill={color}
      />
    </svg>
  ),
  // clover / flower
  (color, i) => (
    <svg key={i} width="60" height="60" viewBox="0 0 60 60">
      <circle cx="20" cy="20" r="14" fill={color} />
      <circle cx="40" cy="20" r="14" fill={color} />
      <circle cx="20" cy="40" r="14" fill={color} />
      <circle cx="40" cy="40" r="14" fill={color} />
    </svg>
  ),
  // lightning bolt
  (color, i) => (
    <svg key={i} width="50" height="60" viewBox="0 0 50 60">
      <polygon points="30,2 10,34 24,34 18,58 42,26 26,26" fill={color} />
    </svg>
  ),
  // diamond gem
  (color, i) => (
    <svg key={i} width="55" height="55" viewBox="0 0 55 55">
      <polygon points="27,2 50,20 40,52 15,52 5,20" fill={color} />
    </svg>
  ),
  // burst star
  (color, i) => (
    <svg key={i} width="60" height="60" viewBox="0 0 60 60">
      <polygon
        points="30,2 36,22 56,22 40,34 46,54 30,42 14,54 20,34 4,22 24,22"
        fill={color}
      />
    </svg>
  ),
];

const flairCount = 10;
const flairElements = Array.from({ length: flairCount }, (_, i) => {
  const ShapeFn = shapes[i % shapes.length];
  const color = colors[i % colors.length];
  return ShapeFn(color, i);
});

const CursorTrail = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const flair = gsap.utils.toArray(".flair");
    let index = 0;
    const wrapper = gsap.utils.wrap(0, flair.length);
    const gap = 100;

    gsap.defaults({ duration: 1 });

    let mousePos = { x: 0, y: 0 };
    let lastMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      mousePos = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    function playAnimation(shape) {
      const tl = gsap.timeline();
      tl.from(shape, {
        opacity: 0,
        scale: 0,
        ease: "elastic.out(1,0.3)",
      })
        .to(shape, { rotation: "random([-360, 360])" }, "<")
        .to(shape, { y: "120vh", ease: "back.in(.4)", duration: 1 }, 0);
    }

    function animateImage() {
      const wrappedIndex = wrapper(index);
      const el = flair[wrappedIndex];
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "all" });
      gsap.set(el, {
        opacity: 1,
        left: mousePos.x,
        top: mousePos.y,
        xPercent: -50,
        yPercent: -50,
      });
      playAnimation(el);
      index++;
    }

    function imageTrail() {
      const travelDistance = Math.hypot(
        lastMousePos.x - mousePos.x,
        lastMousePos.y - mousePos.y,
      );
      if (travelDistance > gap) {
        animateImage();
        lastMousePos = mousePos;
      }
    }

    gsap.ticker.add(imageTrail);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(imageTrail);
    };
  }, []);

  return (
    <div ref={containerRef}>
      {flairElements.map((shape, i) => (
        <div
          key={i}
          className="flair fixed top-0 left-0 opacity-0 pointer-events-none z-[9999]"
        >
          {shape}
        </div>
      ))}
    </div>
  );
};

export default CursorTrail;
