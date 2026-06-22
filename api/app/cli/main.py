import typer

from app.cli.commands import user_cli

app = typer.Typer(help='Base CLI')

app.add_typer(user_cli.app, name='user', help='User CLI')


@app.command()
def info():
    """
    Print information about the CLI.
    """
    print('Base CLI')


if __name__ == '__main__':
    app()
