import React from "react";
import { GripVertical, X } from "lucide-react";

interface DraggableItemProps {
  id: string;
  index: number;
  value: string;
  onEdit: (id: string, newValue: string) => void;
  onRemove: (id: string) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  index,
  value,
  onEdit,
  onRemove,
  onDragStart,
  onDragOver,
}) => {
  return (
    <div
      className="flex items-center gap-2 mb-2 bg-white p-2 rounded shadow transition-all"
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onDragOver={(e) => onDragOver(e, id)}
    >
      <GripVertical className="cursor-grab text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onEdit(id, e.target.value)}
        className="flex-1 border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={`Ingrediente ${index + 1}`}
      />
      <button
        onClick={() => onRemove(id)}
        className="bg-black text-white rounded px-2 py-1 hover:bg-red-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default DraggableItem;
