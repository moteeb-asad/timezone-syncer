import { useEffect, useState } from "react";

const CurrentTime = () => {
  // Add state for live current time
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="text-center">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Local Time
          </h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="bg-primary-light rounded-lg px-3 py-2">
              <span className="text-md md:text-3xl font-bold text-primary uppercase">
                {liveTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-primary">
              :
            </span>
            <div className="bg-primary-light rounded-lg px-3 py-2">
              <span className="text-md md:text-3xl font-bold text-primary">
                {liveTime
                  .toLocaleTimeString([], {
                    minute: "2-digit",
                  })
                  .slice(-2)}
              </span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-primary">
              :
            </span>
            <div className="bg-primary-light rounded-lg px-3 py-2">
              <span className="text-md md:text-3xl font-bold text-primary">
                {liveTime
                  .toLocaleTimeString([], {
                    second: "2-digit",
                  })
                  .slice(-2)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {liveTime.toLocaleDateString([], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTime;
