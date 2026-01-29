{ pkgs, ... }: {
  # 1. Configurações Globais do Ambiente
  channel = "stable-23.11";

  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.wrangler
  ];

  env = {
    NODE_VERSION = "20";
  };

  # 2. Configurações específicas da IDE IDX
  idx = {
    extensions = [
      "cloudflare.wrangler-vscode"
      "googlecloudcompute.cloudcode"
      "esbenp.prettier-vscode"
    ];

    # É AQUI que o onCreate deve morar:
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
    };

    previews = {
      enable = false;
      previews = {
        web = {
          command = [ "wrangler" "dev" "--config" "wrangler.json" "--port" "$PORT" "--ip" "0.0.0.0" ];
          manager = "web";
        };
      };
    };
  };
}