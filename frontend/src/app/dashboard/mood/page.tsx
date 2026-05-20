import { PageHeader } from "@/components/layout/page-header";
import { MoodTracker } from "@/components/mood/mood-tracker";

export default function MoodPage() {
  return (
    <div>
      <PageHeader
        title="Bien-être"
        description="Suivez votre humeur et votre énergie au quotidien"
      />
      <MoodTracker />
    </div>
  );
}
