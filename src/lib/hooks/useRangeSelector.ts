import { useEffect, useState } from "react";
import { Phone } from "@/lib/interfaces/phone";

export const useRangeSelector = (
  phones: Phone[],
  setSelectedPhones: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [range, setRange] = useState<number>(phones.length);
  const [startIndex, setStartIndex] = useState<number>(1);
  const [endIndex, setEndIndex] = useState<number>(range);

  useEffect(() => {
    setRange(phones.length);
    setStartIndex(1);
    setEndIndex(phones.length);
  }, [phones]);

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRange(parseInt(e.target.value));
  };

  const handleStartIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartIndex(parseInt(e.target.value));
  };

  const handleEndIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndIndex(parseInt(e.target.value));
  };

  const handleSelectRange = () => {
    if (startIndex < 1 || endIndex > phones.length) return;

    const newSelectedPhones = phones
      .slice(startIndex - 1, endIndex)
      .map((p) => p.id);
    setSelectedPhones(newSelectedPhones);
  };

  return {
    range,
    startIndex,
    endIndex,
    setRange,
    setStartIndex,
    setEndIndex,
    handleRangeChange,
    handleStartIndexChange,
    handleEndIndexChange,
    handleSelectRange,
  };
};
