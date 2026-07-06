import { ScrollTrigger, SplitText} from "gsap/all";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger,SplitText);

const App = () => {
  return (
    <div className="flex-center h-screen">
      <h1 className="text-3xl text-blue-400">
        Hello Gsap
      </h1>
    </div>
  )
}

export default App
