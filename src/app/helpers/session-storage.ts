export class SessionStorage {
  public get<T>(key: string): T | null {
    const value = sessionStorage.getItem(key);
    return value === null ? null : (JSON.parse(value) as T);
  }

  public set<T>(key: string, value: T): void {
    const serializedValue = JSON.stringify(value);

    if (serializedValue === undefined) {
      throw new TypeError(`Value for "${key}" cannot be serialized to JSON.`);
    }

    sessionStorage.setItem(key, serializedValue);
  }

  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}
