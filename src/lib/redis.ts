import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Fallback to in-memory store if Redis is not configured (useful for hackathons)
class InMemoryRedis {
  private store = new Map<string, any>();

  async set(key: string, value: string, ex?: string, ttl?: number) {
    this.store.set(key, { value, expires: ttl ? Date.now() + ttl * 1000 : null });
  }

  async get(key: string) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expires && Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async smembers(key: string) {
    return Array.from(this.store.keys()).filter(k => k.startsWith(key));
  }

  async rpush(key: string, value: string) {
    const item = this.store.get(key) || { value: '[]', expires: null };
    const arr = JSON.parse(item.value);
    arr.push(value);
    this.store.set(key, { value: JSON.stringify(arr), expires: item.expires });
  }

  async lpop(key: string) {
    const item = this.store.get(key);
    if (!item) return null;
    const arr = JSON.parse(item.value);
    if (arr.length === 0) return null;
    const val = arr.shift();
    this.store.set(key, { value: JSON.stringify(arr), expires: item.expires });
    return val;
  }
}

export const redis =
  globalForRedis.redis ??
  (process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : (new InMemoryRedis() as any));

if (process.env.NODE_ENV !== 'production' && process.env.REDIS_URL) {
  globalForRedis.redis = redis;
}
