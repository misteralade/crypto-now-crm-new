import { useState } from 'react'
import { Copy } from 'lucide-react'
// import Copy from "../../assets/img/fluent_copy-16-regular.svg"

interface CopyDetailsProps {
  text: string;
    className?: string;
  iconClassName?: string;
}

const CopyDetails = ({text, className, iconClassName}: CopyDetailsProps) => {
    const [response, setResponse] = useState<string>("");
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text)
            .then(() => {
                setResponse("Copied!");

                setTimeout(() => setResponse(""), 2000);
            })
            .catch(err => {
                setResponse(`Error!: ${err}`);
            });
    };
    return (
      <div
        className={`flex gap-2 items-center relative max-w-[400px] ${className}`}
      >
        <code
          className={`font-mono text-[12px] text-[#667085] overflow-hidden whitespace-nowrap text-ellipsis`}
        >
          {text}
        </code>

        <button
          onClick={handleCopy}
          className="p-1 rounded-lg hover:bg-[#F5F5FF] transition-colors flex-shrink-0"
          aria-label="Copy to clipboard"
        >
          <Copy
            className={`text-[#948EEE] hover:text-[#03034D] h-3.5 w-3.5 ${iconClassName}`}
          />
        </button>

        {response && (
          <span
            className={`text-[#037847] text-[11px] font-medium absolute -top-5 right-0 bg-[#ECFDF3] px-2 py-0.5 rounded-full transition-all duration-300`}
          >
            {response}
          </span>
        )}
      </div>
    )
}

interface ClickableDetailsProps {
  text: string;
  onClick: (value: any) => void;
  className?: string;
}

export const ClickableDetails = ({ text, onClick, className }: ClickableDetailsProps) => {
  const [clicked, setClicked] = useState(false);
  
  const handleClick = () => {
    setClicked(true);
    onClick(text);
    setTimeout(() => setClicked(false), 1500);
  };
  
  return (
    <div className={`relative flex items-center gap-2 max-w-[200px] w-3/4 md:w-fit ${className}`}>
      <a
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