import { useState, type MouseEvent } from 'react'
import { Copy } from 'lucide-react'
// import Copy from "../../assets/img/fluent_copy-16-regular.svg"

interface CopyDetailsProps {
  text: string;
    className?: string;
  iconClassName?: string;
  wrap?: boolean;
}

const CopyDetails = ({text, className, iconClassName, wrap}: CopyDetailsProps) => {
    const [response, setResponse] = useState<string>("");
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setResponse("Copied!");

                setTimeout(() => setResponse(""), 2000);
            })
            .catch(err => {
                setResponse(`Error!: ${err}`);
            });
    };

    const cleanIconClass = iconClassName
      ? iconClassName.replace(/!?(w|h)-(8|6)/g, "").trim()
      : "";

    return (
      <div
        className={`flex gap-2 items-center relative ${!wrap ? "max-w-[400px]" : "w-full"} w-3/4 md:w-fit ${className}`}
      >
        <p
          className={`text-black overflow-hidden ${wrap ? "break-all" : "whitespace-nowrap text-ellipsis"}`}
        >
          {text}
        </p>

        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded text-purple-600 hover:bg-purple-50 active:scale-95 transition-all shrink-0 cursor-pointer flex items-center justify-center"
          title="Copy"
          aria-label="Copy"
        >
          <Copy
            className={`w-4 h-4 ${cleanIconClass}`}
          />
        </button>

        {response && (
          <span
            className={`text-accent2 text-xs absolute -top-5 right-0 bg-gray-900 text-white px-2 py-0.5 rounded shadow-sm z-10 transition-all duration-300`}
          >
            {response}
          </span>
        )}
      </div>
    )
}

interface ClickableDetailsProps {
  text: string;
  onClick: (value: string) => void;
  className?: string;
}

export const ClickableDetails = ({ text, onClick, className }: ClickableDetailsProps) => {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setClicked(true);
    onClick(text);
    setTimeout(() => setClicked(false), 1500);
  };
  
  return (
    <div className={`relative flex items-center gap-2 max-w-[200px] w-3/4 md:w-fit ${className}`}>
      <a
        href="#"
        onClick={handleClick}
        className={`text-blue-600 overflow-hidden whitespace-nowrap text-ellipsis hover:underline cursor-pointer`}
      >
        {text}
      </a>
      
      {clicked && (
        <span className="text-green-500 text-sm absolute -top-5 left-0 transition-all duration-300">
          Clicked!
        </span>
      )}
    </div>
  );
};

export default CopyDetails;
