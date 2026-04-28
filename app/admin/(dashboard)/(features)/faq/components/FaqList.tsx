import { FaqItem } from "./FaqItem";

interface FaqListProps {
  faqs: Array<{ _id: string; question: string; answer: string }>;
  onEdit: (faq: any) => void;
  onDelete: (id: string) => void;
}

export const FaqList = ({ faqs, onEdit, onDelete }: FaqListProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      {faqs.map((faq) => (
        <FaqItem key={faq._id} faq={faq} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
