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

export default CopyDetails
