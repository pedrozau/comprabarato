import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* Círculo externo */}
        <motion.div
          className="absolute inset-0 border-4 border-t-[#4169E1] border-r-[#32CD32] border-b-[#4169E1] border-l-[#32CD32] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Ícone do carrinho estilizado */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-[#4169E1]"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </motion.div>
      </motion.div>
      <motion.p
        className="mt-4 text-lg font-medium text-[#4169E1]"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        Carregando melhores ofertas...
      </motion.p>
    </div>
  );
} 