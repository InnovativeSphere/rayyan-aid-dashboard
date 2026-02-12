"use client";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-14">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-4 h-4 bg-[#f59320] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
