import { useState, type MouseEvent } from 'react'
import { Copy } from 'lucide-react'
// import Copy from "../../assets/img/fluent_copy-16-regular.svg"

interface CopyDetailsProps {
  text: string;
    className?: string;
  iconClassName?: string;
}

const CopyDetails = ({text, className, iconClassName}: CopyDetailsProps) => {
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
    return (
      <div
        className={`flex gap-2 items-center relative max-w-[400px] w-3/4 md:w-fit ${className}`}
      >
        <p
          className={`text-black overflow-hidden whitespace-nowrap text-ellipsis`}
        >
          {text}
        </p>

        <Copy
          className={`text-purple-600 hover:cursor-pointer h-18 w-1 ${iconClassName}`}
          onClick={handleCopy}
        />

        <p
          className={`text-accent2 text-sm absolute -top-5 right-0 transition-all duration-500`}
        >
          {response}
        </p>
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
