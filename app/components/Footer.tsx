import { FunctionComponent } from "react";

interface FooterProps {}

const Footer: FunctionComponent<FooterProps> = () => {
  return (
    <footer className="py-8 bg-[#353929] text-gray-200">
      <div className="container mx-auto text-center px-6">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Congresso Jovens 2025 - IEADPE
          Petrolina
        </p>
        <p className="text-sm">
          Praça Pr. José Ferreira da Silva - Vila Moco, Petrolina - PE,
          56306-390
        </p>
      </div>
    </footer>
  );
};

export default Footer;
