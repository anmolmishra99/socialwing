import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LocationInput = ({
  district,
  taluka,
  village,
  onDistrictChange,
  onTalukaChange,
  onVillageChange,
  disabled = false
}) => {
  const isComplete = district.trim() && taluka.trim() && village.trim();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Location Information</CardTitle>
            <CardDescription>
              Enter the location details for the land records being uploaded
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district" className="flex items-center gap-2">
                District *
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </Label>
              <Input
                id="district"
                value={district}
                onChange={(e) => onDistrictChange(e.target.value)}
                placeholder="Enter district name"
                disabled={disabled}
                className={!district.trim() ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taluka" className="flex items-center gap-2">
                Taluka *
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </Label>
              <Input
                id="taluka"
                value={taluka}
                onChange={(e) => onTalukaChange(e.target.value)}
                placeholder="Enter taluka name"
                disabled={disabled}
                className={!taluka.trim() ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="village" className="flex items-center gap-2">
                Village *
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </Label>
              <Input
                id="village"
                value={village}
                onChange={(e) => onVillageChange(e.target.value)}
                placeholder="Enter village name"
                disabled={disabled}
                className={!village.trim() ? "border-destructive" : ""}
              />
            </div>
          </div>

          {/* Location Preview */}
          {isComplete && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Summary
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">District:</span>
                  <span className="font-medium">{district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taluka:</span>
                  <span className="font-medium">{taluka}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Village:</span>
                  <span className="font-medium">{village}</span>
                </div>
              </div>
            </div>
          )}

          {/* Validation Status */}
          {!isComplete && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fill in all location fields (District, Taluka, Village) before uploading data.
              </AlertDescription>
            </Alert>
          )}

          {isComplete && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                All location fields are filled. This information will be applied to all uploaded records.
              </AlertDescription>
            </Alert>
          )}

          {/* Common Locations (Examples) */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Quick Fill Examples:</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDistrictChange('Palghar');
                  onTalukaChange('Vasai');
                  onVillageChange('Nallasopara');
                }}
                disabled={disabled}
              >
                Vasai-Palghar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDistrictChange('Palghar');
                  onTalukaChange('Talasari');
                  onVillageChange('Talasari');
                }}
                disabled={disabled}
              >
                Talasari
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDistrictChange('Palghar');
                  onTalukaChange('Dahanu');
                  onVillageChange('Dahanu');
                }}
                disabled={disabled}
              >
                Dahanu
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInput;