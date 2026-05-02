import { useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  return (
    <div className="page">
      <p>Edit post {id} (coming soon)</p>
    </div>
  );
}
