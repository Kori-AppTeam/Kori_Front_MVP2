import React, { useCallback, useMemo } from 'react';
import DatePicker from 'react-native-date-picker';

interface BirthPickerProps {
  isShow: boolean;
  onClose: () => void;
  setDate: (date: string) => void;
  date?: string;
}

export default function BirthPicker({ isShow, onClose, date, setDate }: BirthPickerProps) {
  const minDate = useMemo(() => new Date(1900, 0, 1), []);
  const maxDate = useMemo(() => {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }, []);

  // mm/dd/yyyy 형식을 Date로 parse
  const parseBirthFormatToDate = useCallback((birthFormat: string) => {
    const [month, day, year] = birthFormat.split('/').map(Number);
    return new Date(year, month - 1, day);
  }, []);

  // Date를 mm/dd/yyyy 형식으로 format
  const formatDateToBirth = useCallback((date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${month}/${day}/${year}`;
  }, []);

  // date를 유효 범위 내로 조정
  const validDate = useMemo(() => {
    if (!date) return maxDate;

    const parsedDate = parseBirthFormatToDate(date);

    if (parsedDate > maxDate) return maxDate;
    if (parsedDate < minDate) return minDate;
    return parsedDate;
  }, [date, maxDate, minDate]);

  if (!isShow) return null;

  return (
    <DatePicker
      modal
      mode="date"
      theme="dark"
      title={null}
      open={isShow}
      date={validDate}
      minimumDate={minDate}
      maximumDate={maxDate}
      onConfirm={(date) => {
        onClose();
        setDate(formatDateToBirth(date));
      }}
      onCancel={() => {
        onClose();
      }}
    />
  );
}
