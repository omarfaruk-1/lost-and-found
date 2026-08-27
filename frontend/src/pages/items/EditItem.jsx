import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ItemForm from "../../components/items/ItemForm";
import { itemApi } from "../../services/api";
import Spinner from "../../components/ui/Spinner";

export default function EditItem() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { itemApi.get(itemId).then(({data}) => setItem(data.item)); }, [itemId]);

  if (!item) return <Spinner label="Loading item..." />;

  const submit = async (data) => {
    setLoading(true);
    try {
      await itemApi.update(itemId, data);
      navigate(`/items/${itemId}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container form-container">
        <Link to={`/items/${itemId}`} className="back-link"><ArrowLeft size={16}/> Back to item</Link>
        <div className="page-header compact"><div><div className="eyebrow">EDIT REPORT</div><h1>Update your report</h1></div></div>
        <div className="panel form-panel"><ItemForm initialValues={item} onSubmit={submit} loading={loading} submitLabel="Save changes"/></div>
      </div>
    </div>
  );
}