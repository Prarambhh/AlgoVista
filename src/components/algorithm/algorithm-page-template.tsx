import React, { Suspense } from "react";
import { VisualizationStep } from "@/lib/visualization-utils";
import AlgorithmPageTemplateClient from "./algorithm-page-template-client";

interface AlgorithmPageTemplateProps {
  title: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  visualizationComponent: React.ComponentType<{
    step: VisualizationStep;
    data?: any[];
    onDataChange?: (data: any[]) => void;
  }>;
  generateSteps: (data: any[]) => VisualizationStep[];
  initialData: any[];
  dataInputComponent?: React.ComponentType<{
    data: any[];
    onDataChange: (data: any[]) => void;
  }>;
  pseudocode: string[];
  relatedProblems: Array<{
    id: number;
    title: string;
    slug: string;
    difficulty: string;
  }>;
  category: string;
}

// Server component wrapper with Suspense
export default function AlgorithmPageTemplate(props: AlgorithmPageTemplateProps) {
  return (
    <Suspense fallback={<div className="container-px py-8 text-muted">Loading...</div>}>
      <AlgorithmPageTemplateClient {...props} />
    </Suspense>
  );
}

export type { AlgorithmPageTemplateProps };