import { CalendarDays, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryLabel, typeLabel } from "../../config";
import { formatRelative } from "../../utils/format";

export default function ItemCard({ item }) {
  const image = item.images?.[0]?.url;
  return (
    <article className="item-card">
      <Link to={`/items/${item._id}`} className="item-image">
        {image ? <img src={image} alt={item.itemName} /> : <div className="image-placeholder"><Tag size={28}/></div>}
        <span className={`status-badge ${item.type}`}>{typeLabel(item.type)}</span>
        {item.status === "resolved" && <span className="resolved-badge">Resolved</span>}
      </Link>
      <div className="item-content">
        <div className="eyebrow">{categoryLabel(item.category)}</div>
        <h3><Link to={`/items/${item._id}`}>{item.itemName}</Link></h3>
        <p className="item-description">{item.description}</p>
        <div className="item-meta">
          <span><MapPin size={14}/>{item.location}</span>
          <span><CalendarDays size={14}/>{formatRelative(item.date)}</span>
        </div>
      </div>
    </article>
  );
}