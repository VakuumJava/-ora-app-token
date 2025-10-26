export function BackgroundGradients() {
  return (
    <>
      {/* Top gradient */}
      <div className="absolute w-[600px] h-[600px] left-[50%] top-[-200px] -translate-x-1/2 opacity-30 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[150px]"
          style={{
            background: "radial-gradient(circle, rgba(37, 219, 255, 0.5) 0%, rgba(115, 0, 255, 0.4) 100%)",
          }}
        />
      </div>

      {/* Left gradient */}
      <div className="absolute w-[400px] h-[400px] left-[-100px] top-[200px] opacity-25 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(37, 219, 255, 0.4) 0%, rgba(115, 0, 255, 0.3) 100%)",
          }}
        />
      </div>

      {/* Right gradient 1 */}
      <div className="absolute w-[500px] h-[500px] right-[-150px] top-[500px] opacity-25 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(115, 0, 255, 0.4) 0%, rgba(37, 219, 255, 0.3) 100%)",
          }}
        />
      </div>

      {/* Middle left */}
      <div className="absolute w-[450px] h-[450px] left-[10%] top-[1000px] opacity-22 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[130px]"
          style={{
            background: "radial-gradient(circle, rgba(37, 219, 255, 0.4) 0%, rgba(115, 0, 255, 0.3) 100%)",
          }}
        />
      </div>

      {/* Pink gradient */}
      <div className="absolute w-[350px] h-[350px] right-[15%] top-[300px] opacity-20 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(255, 0, 191, 0.35) 0%, rgba(0, 200, 255, 0.25) 100%)",
          }}
        />
      </div>

      {/* Blue gradient middle */}
      <div className="absolute w-[300px] h-[300px] left-[20%] top-[600px] opacity-22 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[110px]"
          style={{
            background: "radial-gradient(circle, rgba(0, 200, 255, 0.4) 0%, rgba(9, 0, 255, 0.3) 100%)",
          }}
        />
      </div>

      {/* Right gradient 2 */}
      <div className="absolute w-[400px] h-[400px] right-[-50px] top-[900px] opacity-23 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[125px]"
          style={{
            background: "radial-gradient(circle, rgba(115, 0, 255, 0.45) 0%, rgba(255, 0, 191, 0.3) 100%)",
          }}
        />
      </div>

      {/* Bottom left */}
      <div className="absolute w-[320px] h-[320px] left-[60%] top-[1200px] opacity-21 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[105px]"
          style={{
            background: "radial-gradient(circle, rgba(37, 219, 255, 0.38) 0%, rgba(115, 0, 255, 0.28) 100%)",
          }}
        />
      </div>

      {/* Bottom left corner */}
      <div className="absolute w-[280px] h-[280px] left-[-80px] top-[1400px] opacity-20 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[95px]"
          style={{
            background: "radial-gradient(circle, rgba(255, 0, 191, 0.32) 0%, rgba(37, 219, 255, 0.25) 100%)",
          }}
        />
      </div>

      {/* Bottom right */}
      <div className="absolute w-[360px] h-[360px] right-[25%] top-[1600px] opacity-22 pointer-events-none">
        <div
          className="w-full h-full rounded-full blur-[115px]"
          style={{
            background: "radial-gradient(circle, rgba(0, 200, 255, 0.4) 0%, rgba(115, 0, 255, 0.3) 100%)",
          }}
        />
      </div>
    </>
  )
}
