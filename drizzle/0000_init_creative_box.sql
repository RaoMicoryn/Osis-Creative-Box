CREATE TYPE "public"."creative_box_kategori" AS ENUM('lingkungan', 'acara_sekolah', 'fasilitas', 'akademik', 'lainnya');--> statement-breakpoint
CREATE TYPE "public"."creative_box_status" AS ENUM('pending', 'dibaca_osis', 'disetujui_pembina', 'ditolak');--> statement-breakpoint
CREATE TABLE "creative_box_aspirations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul_ide" varchar(255) NOT NULL,
	"kategori" "creative_box_kategori" NOT NULL,
	"deskripsi_ide" text NOT NULL,
	"detail_pengerjaan" text,
	"manfaat" text,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"nama_siswa" varchar(100),
	"kelas" varchar(20),
	"kontak" varchar(100),
	"status" "creative_box_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cb_deskripsi_max_500" CHECK (char_length("creative_box_aspirations"."deskripsi_ide") <= 500),
	CONSTRAINT "cb_detail_max_1000" CHECK ("creative_box_aspirations"."detail_pengerjaan" IS NULL OR char_length("creative_box_aspirations"."detail_pengerjaan") <= 1000),
	CONSTRAINT "cb_manfaat_max_1000" CHECK ("creative_box_aspirations"."manfaat" IS NULL OR char_length("creative_box_aspirations"."manfaat") <= 1000),
	CONSTRAINT "cb_anonim_tanpa_identitas" CHECK (NOT "creative_box_aspirations"."is_anonymous" OR ("creative_box_aspirations"."nama_siswa" IS NULL AND "creative_box_aspirations"."kelas" IS NULL AND "creative_box_aspirations"."kontak" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "rate_limit_hits" (
	"key" varchar(128) NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rate_limit_hits_key_window_start_pk" PRIMARY KEY("key","window_start")
);
--> statement-breakpoint
CREATE INDEX "cb_status_created_idx" ON "creative_box_aspirations" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "cb_kategori_created_idx" ON "creative_box_aspirations" USING btree ("kategori","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "cb_created_idx" ON "creative_box_aspirations" USING btree ("created_at" DESC NULLS LAST);