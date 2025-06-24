import { Code2, Users, Share2, Play, Zap } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
function Room(){
    let navigate = useNavigate();
    function handleRoomDetails(e){
        e.preventDefault();
        navigate("/room/playground");
    }
    return (
        <div className="min-h-screen bg-gradient-to-br bg-gray-950">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <Code2 className="w-10 h-10 text-blue-400" />
                    <h1 className="text-3xl font-bold text-white">Code Bit</h1>
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Real-time collaborative code editor supporting C++, Java, and Python. 
                    Share code, collaborate instantly, and build together.
                </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {/* Create Room */}
                <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-600 rounded-lg">
                        <Play className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Create Room</h2>
                    </div>
                    
                    <form onSubmit={handleRoomDetails} className="space-y-4">
                    <div>
                        <label htmlFor="roomName" className="block text-sm font-medium text-gray-300 mb-2">
                        Room Name
                        </label>
                        <input
                        type="text"
                        id="roomName"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg focus:outline-2 outline-green-500  text-white placeholder-gray-400"
                        placeholder="My Awesome Project"
                        required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                        Programming Language
                        </label>
                        <select
                        id="language"
                        className="w-full px-4 py-3 bg-gray-800  rounded-lg focus:outline-2 outline-green-500 text-white"
                        >
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        </select>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                       
                        <>
                            <Zap className="w-5 h-5" />
                            Create Room
                        </>
                    </button>
                    </form>
                </div>

                {/* Join Room */}
                <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-600 rounded-lg">
                        <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Join Room</h2>
                    </div>
                    
                    <form className="space-y-4">
                    <div>
                        <label htmlFor="joinRoomId" className="block text-sm font-medium text-gray-300 mb-2">
                        Room ID
                        </label>
                        <input
                        type="text"
                        id="joinRoomId"
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg  focus:outline-2 outline-blue-500  text-white placeholder-gray-400"
                        placeholder="Enter room ID"
                        required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <Users className="w-5 h-5" />
                        Join Room
                    </button>
                    </form>
                </div>
                </div>
            </div>
        </div>
    )
}
export default Room;