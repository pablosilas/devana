import { useState } from "react";
import type { FakeData } from "../../types/types";

type DataType = "all" | "cpf" | "cnpj" | "personal" | "contact" | "address";

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

  const [selectedType, setSelectedType] = useState<DataType>("all");

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
    "Bruno Almeida",
    "Fernanda Lima",
    "Rafael Gonçalves",
    "Juliana Ribeiro",
    "Eduardo Martins",
    "Patricia Rocha",
  ];

  const domains = [
    "gmail.com",
    "hotmail.com",
    "yahoo.com",
    "outlook.com",
    "uol.com.br",
  ];

  const streets = [
    "Rua das Flores",
    "Avenida Paulista",
    "Rua Augusta",
    "Alameda Santos",
    "Rua Oscar Freire",
    "Avenida Faria Lima",
    "Rua da Consolação",
    "Rua Haddock Lobo",
  ];

  const generatePersonalData = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    return { name };
  };

  const generateContactData = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name
      .toLowerCase()
      .replace(/\s+/g, ".")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`;
    const phone = `(${Math.floor(Math.random() * 90) + 10}) ${
      Math.floor(Math.random() * 90000) + 10000
    }-${Math.floor(Math.random() * 9000) + 1000}`;

    return { email, phone };
  };

  const generateAddressData = () => {
    const cep = `${Math.floor(Math.random() * 90000) + 10000}-${
      Math.floor(Math.random() * 900) + 100
    }`;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const address = `${street}, ${Math.floor(Math.random() * 900) + 100}`;

    return { cep, address };
  };

  const generateAllData = () => {
    const name = names[Math.floor(Math.random() * names.length)];
    const email = `${name
      .toLowerCase()
      .replace(/\s+/g, ".")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`;
    const phone = `(${Math.floor(Math.random() * 90) + 10}) ${
      Math.floor(Math.random() * 90000) + 10000
    }-${Math.floor(Math.random() * 9000) + 1000}`;
    const cep = `${Math.floor(Math.random() * 90000) + 10000}-${
      Math.floor(Math.random() * 900) + 100
    }`;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const address = `${street}, ${Math.floor(Math.random() * 900) + 100}`;

    return {
      cpf: generateCPF(),
      cnpj: generateCNPJ(),
      name,
      email,
      phone,
      cep,
      address,
    };
  };

  const generateFakeData = () => {
    let newData: Partial<FakeData> = {};

    switch (selectedType) {
      case "cpf":
        newData = { cpf: generateCPF() };
        break;
      case "cnpj":
        newData = { cnpj: generateCNPJ() };
        break;
      case "personal":
        newData = generatePersonalData();
        break;
      case "contact":
        newData = generateContactData();
        break;
      case "address":
        newData = generateAddressData();
        break;
      case "all":
      default:
        newData = generateAllData();
        break;
    }

    setFakeData((prev) => ({ ...prev, ...newData }));
  };

  const clearData = () => {
    setFakeData({
      cpf: "",
      cnpj: "",
      name: "",
      email: "",
      phone: "",
      cep: "",
      address: "",
    });
  };

  const copyAllData = () => {
    const dataText = Object.entries(fakeData)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
      .join("\n");

    navigator.clipboard.writeText(dataText);
  };

  const dataTypeOptions = [
    { value: "all", label: "Todos os Dados" },
    { value: "cpf", label: "Apenas CPF" },
    { value: "cnpj", label: "Apenas CNPJ" },
    { value: "personal", label: "Dados Pessoais" },
    { value: "contact", label: "Contato" },
    { value: "address", label: "Endereço" },
  ];

  const hasData = Object.values(fakeData).some((value) => value);

  return (
    <div className="p-6 bg-gray-900 text-white h-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold">Gerador de Dados Fake</h3>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as DataType)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {dataTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={generateFakeData}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium"
              >
                Gerar
              </button>

              {hasData && (
                <>
                  <button
                    onClick={copyAllData}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Copiar Tudo
                  </button>

                  <button
                    onClick={clearData}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Limpar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Data Fields */}
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(fakeData).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-3">
              <label className="w-16 text-sm font-medium capitalize text-gray-300">
                {key === "cpf"
                  ? "CPF"
                  : key === "cnpj"
                  ? "CNPJ"
                  : key === "cep"
                  ? "CEP"
                  : key === "name"
                  ? "Nome"
                  : key === "email"
                  ? "Email"
                  : key === "phone"
                  ? "Telefone"
                  : key === "address"
                  ? "Endereço"
                  : key}
                :
              </label>
              <input
                type="text"
                value={value}
                readOnly
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={value ? "" : "Não gerado"}
              />
              {value && (
                <button
                  onClick={() => navigator.clipboard.writeText(value)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-xs rounded-lg transition-colors font-medium"
                >
                  Copiar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded-lg">
          <p>
            <strong>Dica:</strong> Selecione o tipo de dados que deseja gerar ou
            escolha "Todos os Dados" para gerar um conjunto completo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FakeDataGenerator;
