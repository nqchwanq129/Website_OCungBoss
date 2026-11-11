"""Exercise the configured stdio MCP against public docs and a harmless probe."""

import asyncio
import json
from pathlib import Path
from uuid import uuid4

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def check():
    root = Path(__file__).resolve().parents[1]
    probe = root / '.tools' / 'serena-ignore-check.txt'
    marker = 'SAFE_IGNORE_' + uuid4().hex
    probe.write_text(marker, encoding='utf-8')
    params = StdioServerParameters(
        command=str(root / '.tools/serena-runtime/Scripts/python.exe'),
        args=[str(root / 'tools/serena_mcp.py')],
        cwd=str(root),
    )
    try:
        async with stdio_client(params) as (reader, writer):
            async with ClientSession(reader, writer, read_timeout_seconds=45) as session:
                await session.initialize()
                catalog = await session.list_tools()
                names = {tool.name for tool in catalog.tools}
                print('MCP catalog received', flush=True)
                allowed = {
                    'list_dir', 'find_file', 'search_for_pattern',
                    'get_symbols_overview', 'find_symbol', 'find_referencing_symbols',
                }
                assert names == allowed, f'Unexpected MCP tool set: {sorted(names)}'
                for name, arguments in [
                    ('get_symbols_overview', {'relative_path': 'docs/PROMPTS.md', 'depth': 1}),
                    ('find_symbol', {'name_path_pattern': 'Làm tiếp', 'substring_matching': True, 'relative_path': 'docs/PROMPTS.md', 'include_body': True}),
                    ('search_for_pattern', {'substring_pattern': 'ADMIN.*bắt buộc MFA', 'relative_path': 'docs/specs/auth.md', 'max_answer_chars': 2000}),
                    ('find_file', {'file_mask': 'auth.md', 'relative_path': 'docs/specs', 'skip_ignored_files': True}),
                ]:
                    print(f'Checking {name}', flush=True)
                    result = await session.call_tool(name, arguments)
                    output = '\n'.join(getattr(item, 'text', '') for item in result.content)
                    assert not result.is_error and output, f'{name} failed: {output[:300]}'
                    assert not output.startswith('Error'), f'{name} returned an error'
                    if name == 'get_symbols_overview':
                        assert 'Prompt' in output, f'Markdown symbols unavailable: {output[:500]}'
                    if name == 'find_symbol':
                        assert 'Làm tiếp dự án OCungBoss' in output, 'Expected Markdown section body missing'
                    if name == 'search_for_pattern':
                        assert 'MFA' in output, 'Expected public doc match missing'
                    if name == 'find_file':
                        assert 'auth.md' in output, f'Expected public file missing: {output[:300]}'
                blocked = await session.call_tool('search_for_pattern', {
                    'substring_pattern': marker, 'relative_path': '.',
                    'skip_ignored_files': True, 'max_answer_chars': 1000,
                })
                output = '\n'.join(getattr(item, 'text', '') for item in blocked.content)
                assert not blocked.is_error and output.strip() == '{}', 'Expected an empty result for ignored marker'
                print(json.dumps({
                    'status': 'PASS', 'tools': sorted(names),
                    'checks': ['initialize', 'markdown_symbols', 'section_body', 'search_docs', 'find_file', 'ignored_search_path'],
                }))
    finally:
        probe.unlink(missing_ok=True)


if __name__ == '__main__':
    asyncio.run(asyncio.wait_for(check(), timeout=180))
