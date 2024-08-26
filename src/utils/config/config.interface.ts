export interface IConfigService {
    get<T = any>(key: string, defaultValue?: T): T | undefined;
}
