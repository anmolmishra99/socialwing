import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Upload, CheckCheck, XCircle } from 'lucide-react';

export const UploadProgress = ({
  progress,
  currentRecord,
  totalRecords,
  errors,
  isComplete
}) => {
  const getStatusColor = () => {
    if (errors.length > 0) return 'destructive';
    if (isComplete) return 'success';
    return 'default';
  };

  const getStatusIcon = () => {
    if (errors.length > 0) return <AlertCircle className="h-5 w-5" />;
    if (isComplete) return <CheckCheck className="h-5 w-5" />;
    return <Upload className="h-5 w-5" />;
  };

  const getStatusText = () => {
    if (errors.length > 0) return 'Upload Failed';
    if (isComplete) return 'Upload Complete';
    return 'Uploading...';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <CardTitle>Upload Progress</CardTitle>
            <CardDescription>
              {isComplete 
                ? 'Upload process completed' 
                : `Processing record ${currentRecord} of ${totalRecords}`
              }
            </CardDescription>
          </div>
          <Badge variant={getStatusColor()} className="ml-auto">
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{currentRecord}</div>
              <div className="text-xs text-muted-foreground">Processed</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">{totalRecords - currentRecord}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{errors.length}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>

          {/* Success Message */}
          {isComplete && errors.length === 0 && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Successfully uploaded all {totalRecords} records to Firebase. The data is now available in the system.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Summary */}
          {errors.length > 0 && (
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload completed with {errors.length} error{errors.length > 1 ? 's' : ''}. 
                  {totalRecords - errors.length} records were successfully uploaded.
                </AlertDescription>
              </Alert>

              <details className="border rounded-lg">
                <summary className="cursor-pointer p-3 font-medium text-sm hover:bg-muted/50">
                  View Error Details ({errors.length})
                </summary>
                <div className="border-t p-3 space-y-2 max-h-32 overflow-y-auto">
                  {errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                      <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Processing Animation */}
          {!isComplete && progress > 0 && progress < 100 && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Processing records... This may take a few moments.
            </div>
          )}

          {/* Completion Summary */}
          {isComplete && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-3">Upload Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Records:</span>
                  <span className="font-medium">{totalRecords}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Successful:</span>
                  <span className="font-medium text-green-600">{totalRecords - errors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Failed:</span>
                  <span className="font-medium text-red-600">{errors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span className="font-medium">
                    {totalRecords > 0 ? ((totalRecords - errors.length) / totalRecords * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadProgress;