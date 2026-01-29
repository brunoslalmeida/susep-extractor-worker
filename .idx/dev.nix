{ pkgs, ... }: {
  # Pacotes do canal estável
  channel = "stable-23.11";

  packages = [
    pkgs.nodejs_20           # Node.js estável para Workers
    pkgs.nodePackages.pnpm   # Opcional, mas recomendado para performance
    pkgs.wrangler            # CLI oficial da Cloudflare
  ];

  # Variáveis de ambiente úteis
  env = {
    NODE_VERSION = "20";
  };

  idx = {
    # Extensões úteis para Cloudflare e Firebase
    extensions = [
      "cloudflare.wrangler-vscode" # Suporte nativo ao wrangler
      "googlecloudcompute.cloudcode" # Útil para integrações Google/Firebase
      "esbenp.prettier-vscode"      # Padronização de código
    ];

    # Previews no navegador dentro do IDX
    previews = {
      enable = true;
      previews = {
        web = {
          # Executa o worker localmente
          command = ["wrangler", "dev", "--port", "$PORT", "--ip", "0.0.0.0"];
          manager = "web";
        };
      };
    };

    # Ciclo de vida: Instala dependências automaticamente ao criar o ambiente
    onCreate = {
      npm-install = "npm install";
    };
  };
}