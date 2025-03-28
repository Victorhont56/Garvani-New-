interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_REQUIRE_EMAIL_CONFIRMATION: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }


  declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }
