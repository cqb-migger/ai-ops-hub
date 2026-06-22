import typer

app = typer.Typer()


@app.command()
def create(name: str):
    """
    Create a new user.
    """
    print(f'Creating user {name}...')


@app.command()
def list():
    """
    List all users.
    """
    print('Listing users...')
