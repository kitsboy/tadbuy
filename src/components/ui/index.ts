export { Badge } from './Badge';
export { Skeleton, SkeletonText, SkeletonCard } from './Skeleton';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export { Progress } from './Progress';
export { Alert } from './Alert';
export { Chip } from './Chip';
export { Switch } from './Switch';
export { Spinner } from './Spinner';
export { EmptyState } from './EmptyState';
export { StatCard } from './StatCard';
export { Divider } from './Divider';

// Legacy form kit (moved from the colliding src/components/ui.tsx to
// src/components/ui-legacy.tsx so that "@" /components/ui" resolves to this
// directory barrel and can export both generations of components).
export {
  Card, CardTitle, Button, Input, Textarea, Select, Label,
  FileInput, FormGroup, Modal, InfoTooltip,
} from '../ui-legacy';