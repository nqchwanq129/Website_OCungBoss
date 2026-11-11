"""Start the workspace's read-only Serena MCP over stdio."""

import os
import sys
import logging
from pathlib import Path


def main():
    project = Path(__file__).resolve().parents[1]
    os.environ['SERENA_HOME'] = str(project / '.tools' / 'serena-home')
    os.chdir(project)
    logging.disable(logging.INFO)

    from serena.cli import top_level

    sys.argv = [
        'serena', 'start-mcp-server',
        '--project', str(project),
        '--context', 'ide',
        '--agent-interface', 'tools',
        '--enable-web-dashboard', 'false',
        '--open-web-dashboard', 'false',
        '--enable-gui-log-window', 'false',
        '--trace-lsp-communication', 'false',
        '--log-level', 'WARNING',
        *sys.argv[1:],
    ]
    top_level()


if __name__ == '__main__':
    main()
