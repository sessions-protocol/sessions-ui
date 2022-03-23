import { Link } from "react-router-dom";

const PoweredBy = () => {
  return (
    <div className="p-1 text-center text-xs sm:text-right">
      <a href={`https://cal.com?utm_source=embed&utm_medium=powered-by-button`} target="_blank" className="text-gray-500 opacity-50 hover:opacity-100 dark:text-white">
        {"Powered by "}{" "}
        <img
          className="relative -mt-px inline h-[10px] w-auto dark:hidden"
          src=""
          alt="Logo"
        />
        <img
          className="relativ -mt-px hidden h-[10px] w-auto dark:inline"
          src=""
          alt="Logo"
        />
      </a>
    </div>
  );
};

export default PoweredBy;
