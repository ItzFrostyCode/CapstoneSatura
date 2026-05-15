export const safeFormatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateStr;
  }
};

export const isDueSoon = (dueDateStr: string) => {
  if (!dueDateStr) return false;
  const d = new Date(dueDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateMidnight = new Date(d);
  dueDateMidnight.setHours(0, 0, 0, 0);
  
  const diff = dueDateMidnight.getTime() - today.getTime();
  // Return true if due within 3 days (including today)
  return diff >= 0 && diff < 3 * 24 * 60 * 60 * 1000;
};

export const formatPHP = (num: number) => 
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(num);
