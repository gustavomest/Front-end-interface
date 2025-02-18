type Props = {
  status: string;
};

export default function StatusDisplay({ status }: Props) {
  return (
    <div className="text-2xl font-bold mb-4">
      Status do Serviço: <span className="text-blue-600">{status}</span>
    </div>
  );
}
