
import PathfindingVisualizer from "@/components/PathfindingVisualizer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            New Era University Campus Navigator Quezon City Campus
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A* Pathfinding Visualizer
            Interactive pathfinding algorithm visualization on customizable grids. 
            Place walls, set start and goal points, then watch A* find the optimal path.
          </p>
        </div>
        <PathfindingVisualizer />
      </div>
    </div>
  );
};

export default Index;
