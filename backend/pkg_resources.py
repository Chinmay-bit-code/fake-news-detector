"""
pkg_resources compatibility shim for Python 3.14+
pkg_resources was removed in Python 3.14; this file recreates the parts
that djangorestframework-simplejwt needs so the app runs without errors.
"""
from importlib.metadata import version as _get_version, PackageNotFoundError


class DistributionNotFound(Exception):
    pass


class _Distribution:
    def __init__(self, name):
        try:
            self.version = _get_version(name)
        except PackageNotFoundError:
            raise DistributionNotFound(name)


def get_distribution(name):
    return _Distribution(name)


def require(requirements):
    pass


class WorkingSet:
    def __iter__(self):
        return iter([])


working_set = WorkingSet()
