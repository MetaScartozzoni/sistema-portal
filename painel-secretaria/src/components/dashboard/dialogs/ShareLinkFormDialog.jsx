import React from 'react';
import { motion } from 'framer-motion';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Copy, Check } from 'lucide-react';

const ShareLinkFormDialog = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const registrationLink = `${window.location.origin}/register`;

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationLink);
    setCopied(true);
    toast({ title: "Link copiado para a área de transferência!" });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Compartilhar Formulário de Cadastro</h3>
          <p className="text-gray-300 mb-6">Envie este link para que os pacientes possam se cadastrar antes do primeiro contato.</p>
          
          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-2">Link Público</Label>
            <div className="flex items-center gap-2">
              <Input readOnly value={registrationLink} className="bg-white/10 border-white/20 text-white" />
              <Button type="button" variant="outline" size="icon" onClick={handleCopy} className="border-white/20 text-white hover:bg-white/10">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>Fechar</Button>
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
};

export default ShareLinkFormDialog;