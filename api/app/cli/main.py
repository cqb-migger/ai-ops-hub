import typer

from app.cli.commands import user_cli
from app.cli.commands import seed_cli

app = typer.Typer(help='Base CLI')

app.add_typer(user_cli.app, name='user', help='User CLI')
app.add_typer(seed_cli.app, name='seed', help='Database Seed CLI')


@app.command()
def info():
    """
    Print information about the CLI.
    """
    print('Base CLI')


if __name__ == '__main__':
    app()
