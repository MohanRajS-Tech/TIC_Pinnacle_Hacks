
# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "unstable";
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.python3
    pkgs.python3Packages.pip # Correct way to install pip
    pkgs.nodejs_20
    pkgs.python3Packages.google-generativeai # Add the Gemini SDK
    pkgs.firebase-tools # Add Firebase CLI
  ];
  # Sets environment variables in the workspace
  env = {
    FLASK_APP = "main.py";
    GCLOUD_PROJECT = "tic-pinnacle-hack";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "ms-python.python"
      "dbaeumer.vscode-eslint"
      "google.gemini-cli-vscode-ide-companion"
      "csstools.postcss"
    ];
    # Previews are disabled as requested to prevent all port conflicts.
    previews = {
      enable = false;
    };
    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Create a Python virtual environment and install dependencies from requirements.txt
        setup-python = "python3 -m venv .venv && ./.venv/bin/pip install -r requirements.txt";
        # Install JavaScript dependencies for both the root and the 'frontend' directory
        npm-install = "npm install && npm install --prefix frontend";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ ".idx/dev.nix" "README.md" "MVP Details" ];
      };
    };
  };
}
