
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "hstore" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."ItemType" AS ENUM (
    'PARAGRAPH',
    'H1'
);

ALTER TYPE "public"."ItemType" OWNER TO "postgres";

COMMENT ON TYPE "public"."ItemType" IS 'The Types of an item';

CREATE OR REPLACE FUNCTION "public"."decrement_rank_of_items"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Here, NEW refers to the new row being inserted
  IF (TG_OP = 'DELETE') THEN
    UPDATE items_v2 SET rank = rank - 1 WHERE project_id = OLD.project_id and rank >= OLD.rank;
    RETURN OLD;
  END IF;
  RETURN NULL; -- Result is ignored since this is an AFTER trigger
END;
$$;

ALTER FUNCTION "public"."decrement_rank_of_items"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."decrementitemindex"("minrank" integer, "chapter_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update items
  set rank_in_chapter = rank_in_chapter - 1
  where rank_in_chapter >= minrank AND chapter = chapter_id;
$$;

ALTER FUNCTION "public"."decrementitemindex"("minrank" integer, "chapter_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increment_rank_of_items"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Here, NEW refers to the new row being inserted
  IF (TG_OP = 'INSERT') THEN
    UPDATE items_v2 SET rank = rank + 1 WHERE project_id = NEW.project_id and rank >= NEW.rank;
    RETURN NEW;
  END IF;
  RETURN NULL; -- Result is ignored since this is an AFTER trigger
END;
$$;

ALTER FUNCTION "public"."increment_rank_of_items"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increment_rank_of_items"("minrank" integer, "project" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update items_v2
  set rank = rank + 1
  where rank >= minrank AND project_id = project;
$$;

ALTER FUNCTION "public"."increment_rank_of_items"("minrank" integer, "project" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."incrementchapterindex"("minrank" integer, "project_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update chapters
  set index = index + 1
  where index >= minrank AND project = project_id;
$$;

ALTER FUNCTION "public"."incrementchapterindex"("minrank" integer, "project_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."incrementitemindex"("minrank" integer, "chapter_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update items
  set rank_in_chapter = rank_in_chapter + 1
  where rank_in_chapter >= minrank AND chapter = chapter_id;
$$;

ALTER FUNCTION "public"."incrementitemindex"("minrank" integer, "chapter_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_user_on_registration"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Insert the new user into your public table
    INSERT INTO public.profiles (user_id)
    VALUES (new.id);
    return new;
END;
$$;

ALTER FUNCTION "public"."insert_user_on_registration"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_user_on_registration"("new_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Insert the new user into your public table
    INSERT INTO public.users (user_id)
    VALUES (new_user_id);
END;
$$;

ALTER FUNCTION "public"."insert_user_on_registration"("new_user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."chapters" (
    "chapter_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "descriptions" "text",
    "project" "uuid",
    "index" integer
);

ALTER TABLE "public"."chapters" OWNER TO "postgres";

COMMENT ON TABLE "public"."chapters" IS 'The chapters of a project';

COMMENT ON COLUMN "public"."chapters"."index" IS 'The index of the chapter';

CREATE TABLE IF NOT EXISTS "public"."item-types-enum" (
    "id" bigint NOT NULL,
    "type" "text"
);

ALTER TABLE "public"."item-types-enum" OWNER TO "postgres";

COMMENT ON TABLE "public"."item-types-enum" IS 'Enum of the different types of items';

ALTER TABLE "public"."item-types-enum" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."item-types_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."items" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" bigint,
    "chapter" "uuid" NOT NULL,
    "rank_in_chapter" integer NOT NULL,
    "outline" "text",
    "final" "text",
    "item_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."items" OWNER TO "postgres";

COMMENT ON TABLE "public"."items" IS 'all the text items';

COMMENT ON COLUMN "public"."items"."rank_in_chapter" IS 'The rank within a chapter';

ALTER TABLE "public"."items" ALTER COLUMN "rank_in_chapter" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."items_rank_in_chapter_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."items_v2" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "rank" integer NOT NULL,
    "outline" "text",
    "final" "text",
    "item_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "public"."ItemType",
    "version" integer NOT NULL,
    "project_id" "uuid"
);

ALTER TABLE "public"."items_v2" OWNER TO "postgres";

COMMENT ON TABLE "public"."items_v2" IS 'This is a duplicate of items for the refactoring of items';

COMMENT ON COLUMN "public"."items_v2"."rank" IS 'The rank within a chapter';

COMMENT ON COLUMN "public"."items_v2"."type" IS 'The type of the item';

COMMENT ON COLUMN "public"."items_v2"."version" IS 'ascending number of the version of the item';

COMMENT ON COLUMN "public"."items_v2"."project_id" IS 'The project this item is from';

ALTER TABLE "public"."items_v2" ALTER COLUMN "rank" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."items_v2_rank_in_chapter_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1
);

ALTER TABLE "public"."items_v2" ALTER COLUMN "version" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."items_v2_version_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "is_onboarded" boolean DEFAULT false NOT NULL,
    "password_set" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

COMMENT ON COLUMN "public"."profiles"."password_set" IS 'If the user set its password';

CREATE TABLE IF NOT EXISTS "public"."projects" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "project_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    "description" "text",
    "target_group" "text",
    "paragraph_definition" "text" DEFAULT 'A paragraph should be very concise. The first sentence of a paragraph should describe the key message of the paragraph.'::"text",
    "language_description" "text",
    "output_language" "text"
);

ALTER TABLE "public"."projects" OWNER TO "postgres";

COMMENT ON TABLE "public"."projects" IS 'The list of projects of a user';

COMMENT ON COLUMN "public"."projects"."name" IS 'The name of the project';

COMMENT ON COLUMN "public"."projects"."created_by" IS 'The userid of the user who created the project';

COMMENT ON COLUMN "public"."projects"."description" IS 'The description of the project';

COMMENT ON COLUMN "public"."projects"."target_group" IS 'The target group of the project';

COMMENT ON COLUMN "public"."projects"."paragraph_definition" IS 'How should be a paragraph be defined';

COMMENT ON COLUMN "public"."projects"."language_description" IS 'The description on what language is used';

COMMENT ON COLUMN "public"."projects"."output_language" IS 'Language of the output';

CREATE TABLE IF NOT EXISTS "public"."prompts" (
    "id" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "temperature" real DEFAULT '0.9'::real NOT NULL,
    "model_name" "text" DEFAULT 'mistral-tiny'::"text" NOT NULL
);

ALTER TABLE "public"."prompts" OWNER TO "postgres";

COMMENT ON COLUMN "public"."prompts"."model_name" IS 'The mistral model name';

ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("chapter_id");

ALTER TABLE ONLY "public"."item-types-enum"
    ADD CONSTRAINT "item-types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_pkey" PRIMARY KEY ("item_id");

ALTER TABLE ONLY "public"."items_v2"
    ADD CONSTRAINT "items_v2_pkey" PRIMARY KEY ("item_id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("project_id");

ALTER TABLE ONLY "public"."prompts"
    ADD CONSTRAINT "prompts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

CREATE OR REPLACE TRIGGER "decrement_rank_on_delete" AFTER DELETE ON "public"."items_v2" FOR EACH ROW EXECUTE FUNCTION "public"."decrement_rank_of_items"();

CREATE OR REPLACE TRIGGER "increment_rank_on_insert" BEFORE INSERT ON "public"."items_v2" FOR EACH ROW EXECUTE FUNCTION "public"."increment_rank_of_items"();

ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_project_fkey" FOREIGN KEY ("project") REFERENCES "public"."projects"("project_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "items_chapter_fkey" FOREIGN KEY ("chapter") REFERENCES "public"."chapters"("chapter_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."items_v2"
    ADD CONSTRAINT "items_v2_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."items"
    ADD CONSTRAINT "public_items_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."item-types-enum"("id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "public_projects_createdBy_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable all for authenticated users only" ON "public"."chapters" TO "authenticated" USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."chapters" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."items" TO "authenticated" USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "public"."items_v2" TO "authenticated" USING (true);

CREATE POLICY "Enable insert for users based on user_id" ON "public"."profiles" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."items" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable read for authenticated users only" ON "public"."prompts" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "Enable select for authenticated users only" ON "public"."chapters" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "User can only manage own projects" ON "public"."projects" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

ALTER TABLE "public"."chapters" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."item-types-enum" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."items" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."items_v2" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."prompts" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."items";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."items_v2";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."decrement_rank_of_items"() TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_rank_of_items"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_rank_of_items"() TO "service_role";

GRANT ALL ON FUNCTION "public"."decrementitemindex"("minrank" integer, "chapter_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."decrementitemindex"("minrank" integer, "chapter_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrementitemindex"("minrank" integer, "chapter_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."increment_rank_of_items"() TO "anon";
GRANT ALL ON FUNCTION "public"."increment_rank_of_items"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_rank_of_items"() TO "service_role";

GRANT ALL ON FUNCTION "public"."increment_rank_of_items"("minrank" integer, "project" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_rank_of_items"("minrank" integer, "project" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_rank_of_items"("minrank" integer, "project" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."incrementchapterindex"("minrank" integer, "project_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."incrementchapterindex"("minrank" integer, "project_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."incrementchapterindex"("minrank" integer, "project_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."incrementitemindex"("minrank" integer, "chapter_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."incrementitemindex"("minrank" integer, "chapter_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."incrementitemindex"("minrank" integer, "chapter_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_user_on_registration"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_user_on_registration"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_user_on_registration"() TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_user_on_registration"("new_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_user_on_registration"("new_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_user_on_registration"("new_user_id" "uuid") TO "service_role";

GRANT ALL ON TABLE "public"."chapters" TO "anon";
GRANT ALL ON TABLE "public"."chapters" TO "authenticated";
GRANT ALL ON TABLE "public"."chapters" TO "service_role";

GRANT ALL ON TABLE "public"."item-types-enum" TO "anon";
GRANT ALL ON TABLE "public"."item-types-enum" TO "authenticated";
GRANT ALL ON TABLE "public"."item-types-enum" TO "service_role";

GRANT ALL ON SEQUENCE "public"."item-types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."item-types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."item-types_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."items" TO "anon";
GRANT ALL ON TABLE "public"."items" TO "authenticated";
GRANT ALL ON TABLE "public"."items" TO "service_role";

GRANT ALL ON SEQUENCE "public"."items_rank_in_chapter_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."items_rank_in_chapter_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."items_rank_in_chapter_seq" TO "service_role";

GRANT ALL ON TABLE "public"."items_v2" TO "anon";
GRANT ALL ON TABLE "public"."items_v2" TO "authenticated";
GRANT ALL ON TABLE "public"."items_v2" TO "service_role";

GRANT ALL ON SEQUENCE "public"."items_v2_rank_in_chapter_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."items_v2_rank_in_chapter_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."items_v2_rank_in_chapter_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."items_v2_version_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."items_v2_version_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."items_v2_version_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";

GRANT ALL ON TABLE "public"."prompts" TO "anon";
GRANT ALL ON TABLE "public"."prompts" TO "authenticated";
GRANT ALL ON TABLE "public"."prompts" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
