import { useState } from "react";
import type { FakeData } from "../../types/types";

const FakeDataGenerator: React.FC = () => {
  const [fakeData, setFakeData] = useState<FakeData>({
    cpf: "",
    cnpj: "",
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
  });

  const generateCPF = () => {
    const digits = Array.from({ length: 9 }, () =>
      Math.floor(Math.random() * 10)
    );
    const d1 =
      ((digits.reduce((sum, digit, index) => sum + digit * (10 - index), 0) *
        10) %
        11) %
      10;
    const d2 =
      (([...digits, d1].reduce(
        (sum, digit, index) => sum + digit * (11 - index),
        0
      ) *
        10) %
        11) %
      10;
    const cpf = [...digits, d1, d2];
    return cpf.join("").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const generateCNPJ = () => {
    const digits = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10)
    );
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const sum1 = digits.reduce(
      (sum, digit, index) => sum + digit * weights1[index],
      0
    );
    const d1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);

    const sum2 = [...digits, d1].reduce(
      (sum, digit, index) => sum + digit * weights2[index],
      0
    );
    const d2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);

    const cnpj = [...digits, d1, d2];
    return cnpj
      .join("")
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const names = [
    "João Silva",
    "Maria Santos",
    "Pedro Oliveira",
    "Ana Costa",
    "Carlos Souza",
    "Lucia Ferreira",
  ];
  const domains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"];

  const generateFakeData = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name.toLowerCase().replace(" ", ".")}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`;
    const phone = `(${Math.floor(Math.random() * 90) + 10}) ${
      Math.floor(Math.random() * 90000) + 10000
    }-${Math.floor(Math.random() * 9000) + 1000}`;
    const cep = `${Math.floor(Math.random() * 90000) + 10000}-${
      Math.floor(Math.random() * 900) + 100
    }`;

    setFakeData({
      cpf: generateCPF(),
      cnpj: generateCNPJ(),
      name,
      email,
      phone,
      cep,
      address: `Rua ${Math.floor(Math.random() * 1000) + 1}, ${
        Math.floor(Math.random() * 900) + 100
      }`,
    });
  };

  return (
    <div className="p-6 bg-gray-900 text-white h-full">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gerador de Dados Fake</h3>
          <button
            onClick={generateFakeData}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            Gerar Dados
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(fakeData).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-3">
              <label className="w-20 text-sm font-medium capitalize">
                {key}:
              </label>
              <input
                type="text"
                value={value}
                readOnly
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(value)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-xs rounded transition-colors"
              >
                Copiar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FakeDataGenerator;
