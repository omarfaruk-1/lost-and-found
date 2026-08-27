import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ItemForm from "../../components/items/ItemForm";
import { itemApi } from "../../services/api";

export default function CreateItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const submit = async (data) => {
    setLoading(true);
    try {
      const { data: response } = await itemApi.create(data);
      navigate(`/items/${response.data._id}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container form-container">
        <Link to="/dashboard" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>
        <div className="page-header compact">
          <div><div className="eyebrow">NEW REPORT</div><h1>Post a lost or found item</h1><p>Clear details and good photos make recovery much easier.</p></div>
        </div>
        <div className="panel form-panel"><ItemForm onSubmit={submit} loading={loading}/></div>
      </div>
    </div>
  );
}