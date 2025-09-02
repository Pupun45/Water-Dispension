
// import React from "react";

// const WaterJar = ({ liters, maxLiters }) => {
//   const waterHeightPercent = Math.min((liters / maxLiters) * 100, 100);

//   return (
//     <div className="relative w-[200px] h-[300px] flex justify-center items-end">
//       {/* Jar Cap */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-400 rounded-t-lg border border-gray-500 z-30 shadow-md"></div>

//       {/* Jar Body */}
//       <div className="relative w-[180px] h-[250px] bg-blue-200 border border-white/40 rounded-[40px/80px] backdrop-blur-md overflow-hidden shadow-lg z-20">
        
//         {/* Water Waves */}
//         <div
//           style={{ height: `${waterHeightPercent}%` }}
//           className="absolute bottom-0 left-0 w-full overflow-hidden "
//         >
//           <div className="absolute bottom-0 left-0 w-full h-full">
//             <div className="wave"></div>
//             <div className="wave"></div>
//           </div>
//         </div>

//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[50px] bg-white/80 border-2 border-blue-400 rounded-lg shadow-md flex items-center justify-center font-bold text-blue-600 text-lg tracking-wide">
//           Robogenesis
//         </div>

//         {/* Glass highlight */}
//         <div className="absolute top-2 left-2 w-1/2 h-[80%] rounded-[40px/80px] bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
//       </div>
//       <style>{`
//         .wave {
//           background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x;
//           position: absolute;
//           bottom: 0;
//           width: 6400px;
//           height: 198px;
//           animation: wave 7s cubic-bezier(.36,.45,.63,.53) infinite;
//           transform: translate3d(0,0,0);
//         }
//         .wave:nth-of-type(2) {
//           animation: wave 7s cubic-bezier(.36,.45,.63,.53) -.125s infinite, swell 7s ease -1.25s infinite;
//           opacity: 1;
//         }

//         @keyframes wave {
//           0% { margin-left: 0; }
//           100% { margin-left: -1600px; }
//         }

//         @keyframes swell {
//           0%, 100% { transform: translate3d(0,-25px,0); }
//           50% { transform: translate3d(0,5px,0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default WaterJar;


// import React from "react";

// const WaterDrop = ({ liters = 300, maxLiters = 500, label = "Water Tank" }) => {
//   const heightPercent = Math.min((liters / maxLiters) * 100, 100);

//   return (
//     <div className="flex flex-col items-center gap-5 p-5 rounded-2xl">
//       {/* Water Drop */}
//       <div className="relative w-40 h-52 bg-[#e3f2fd] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] overflow-hidden shadow-lg">
        
//         {/* Water Fill */}
//         <div
//           className="absolute bottom-0 left-0 w-full flex items-center justify-center"
//           style={{
//             height: `${heightPercent}%`,
//             background: "linear-gradient(180deg, #1976d2 0%, #0d47a1 100%)",
//             borderRadius: "0 0 50% 50% / 0 0 40% 40%",
//             transition: "height 0.5s ease-out",
//           }}
//         >
//           <span className="text-white font-bold text-2xl drop-shadow-lg">
//             {Math.round(heightPercent)}%
//           </span>
//         </div>
//       </div>

//       {/* Tank Name */}
//       <p className="text-blue-700 font-semibold text-lg uppercase tracking-wide">
//         {label}
//       </p>
//     </div>
//   );
// };

// export default WaterDrop;


import React from "react";

const WaterJar = ({ remaining = 500, tankCapacity = 500, label = "Water Tank" }) => {
  const heightPercent = (remaining / tankCapacity) * 100;

  return (
    <div className="flex flex-col items-center gap-5 p-5 rounded-2xl">
      {/* Tank */}
      <div className="relative w-60 h-70 mt-5 border-4 border-gray-300 rounded-2xl overflow-hidden flex items-end justify-center bg-blue-200 shadow-lg">
        
        {/* Water Level */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden"
          style={{ height: `${heightPercent}%` }}
        >
          <div className="absolute bottom-0 left-0 w-full h-full">
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>

        {/* Label showing remaining liters */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[50px] bg-white/90 border-2 border-blue-400 rounded-lg shadow-md flex items-center justify-center font-bold text-blue-700 text-lg tracking-wide">
          {remaining}L
        </div>
      </div>

      {/* Tank Name */}
      <p className="text-blue-700 font-semibold text-lg uppercase tracking-wide ">
        {label}
      </p>
      <style>{`
        .wave {
          background: url("/src/Components/wave.svg") repeat-x;
          background-size: contain;
          position: absolute;
          bottom: 0;
          width: 6400px;
          height: 198px;
          animation: wave 7s cubic-bezier(.36,.45,.63,.53) infinite;
          transform: translate3d(0,0,0);
        }
        .wave:nth-of-type(2) {
          animation: wave 7s cubic-bezier(.36,.45,.63,.53) -.125s infinite, swell 7s ease -1.25s infinite;
          opacity: 1;
        }
        @keyframes wave {
          0% { margin-left: 0; }
          100% { margin-left: -1600px; }
        }
        @keyframes swell {
          0%, 100% { transform: translate3d(0,-25px,0); }
          50% { transform: translate3d(0,5px,0); }
        }
      `}</style>
    </div>
  );
};

export default WaterJar;
