declare namespace NodeJS {
	export interface ProcessEnv extends Dict<string> {
	  OPENAI_API_KEY: string | undefined;
	  NEXT_PUBLIC_SUPABASE_URL: string | undefined;
	  NEXT_PUBLIC_SUPABASE_PRIVATE_KEY: string | undefined;
	  PRODUCTION: string | undefined;
	  UPSTASH_REDIS_REST_URL: string | undefined;
	  UPSTASH_REDIS_REST_TOKEN: string | undefined;
	  PYTHON_MICRO_SERVER: string | undefined;
	}
}
