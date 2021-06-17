<?php namespace App\Repositories;

//use App\Models\Image as ModelImage;
//use Illuminate\Support\Str;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Traits\CacheableRepository;


class ImageRepository extends BaseRepository implements CacheableInterface
{
    // Setting the lifetime of the cache to a repository specifically
    /**
     * @var int
     */
    protected $cacheMinutes = 90;

    use CacheableRepository;
    /**
     * Specify Model class name
     *
     * @return string
     */
    function model()
    {
        return "App\\Models\\Image";
    }

//    /**
//     * @param $image
//     * @param $type
//     * @return array
//     */
//    public function uploadImage($image, $type, $add_text = true){
//        $folder = self::folderName($type);
//        $token_confirm = Str::random(20);
//        $imageName = $image->getClientOriginalName();
//        $path = $folder .$token_confirm.'_'.$imageName;
//        \Storage::disk('public')->put($path, file_get_contents($image));
//        $this->resizeImage($path);
//        if($add_text) {
//            $this->textWatermark($path);
//        }
//        return [$imageName, $path];
//    }
//
//    /**
//     * @param $image
//     * @param $type
//     * @return array
//     */
//    public function uploadImageBase64($image, $type){
//        $folder = self::folderName($type);
//        $dataBase64 = explode( ',', $image );
//        $token_confirm = Str::random(20);
//        $imageName = $token_confirm.'_'.now().'.jpg';
//        $path = $folder .$imageName;
//        \Storage::disk('public')->put($path, base64_decode($dataBase64[1]));
//        $this->resizeImage($path);
//        $this->textWatermark($path);
//        return [$imageName, $path];
//    }
//
//
//    /**
//     * @param $path
//     * @param $type
//     * @param $imageName
//     * @param $model_id
//     * @return mixed
//     */
//    public function saveImage($path, $type, $imageName, $model_id){
//            $imageData = [];
//            $imageData['path'] = $path;
//            $imageData['name'] = $imageName;
//            $imageData['model_id'] = $model_id;
//            $imageData['type'] = $type;
//            return ModelImage::create($imageData);
//
//    }
//
//    /**
//     * @param $images
//     * @param $type
//     * @param $model_id
//     * @param bool $delete_old
//     */
//    public function saveImages($images, $type, $model_id, $delete_old = true, $add_text = true){
//        if(!$images || $images && !count($images)){
//            return;
//        }
//
//        if($delete_old) {
//            ModelImage::query()->where(["model_id" => $model_id])
//                ->where(["type" => $type])->delete();
//        }
//        foreach ($images as $image){
//            list($imageName, $path) = $this->uploadImage($image, $type, $add_text);
//            $imageData['path'] = $path;
//            $imageData['name'] = $imageName;
//            $imageData['model_id'] = $model_id;
//            //TODO:: add constant type image
//            $imageData['type'] = $type;
//            ModelImage::create($imageData);
//        }
//    }
//
//    /**
//     * @param $images
//     * @param $type
//     * @param $model_id
//     * @param bool $delete_old
//     */
//    public function saveImagesBase64($images, $type, $model_id, $delete_old = true){
//        if(!$images || $images && !count($images)){
//            return;
//        }
//
//        if($delete_old) {
//            ModelImage::query()->where(["model_id" => $model_id])
//                ->where(["type" => $type])->delete();
//        }
//
//        foreach ($images as $image){
//            list($imageName, $path) = $this->uploadImage($image, $type);
//            $imageData['path'] = $path;
//            $imageData['name'] = $imageName;
//            $imageData['model_id'] = $model_id;
//            //TODO:: add constant type image
//            $imageData['type'] = $type;
//            ModelImage::create($imageData);
//        }
//
//    }
//
//    public function resizeImage($path)
//    {
//        $maxWidth = 1200;
//        $maxHeight = 800;
//
//        $img = Image::make(\Storage::disk('public')->path($path));
//        $width = $img->width();
//        $height = $img->height();
//
//      if ($width > $maxWidth || $height > $maxHeight) {
//          $img->height() > $img->width() ? $maxWidth=null : $maxHeight=null;
//          $img->resize($maxWidth, $maxHeight, function ($constraint) {
//              $constraint->aspectRatio();
//          });
//      }
//
//        $img->save(\Storage::disk('public')->path($path));
//    }
//
//    public function textWatermark($path)
//    {
//        $img = Image::make(\Storage::disk('public')->path($path));
//
//        $img->text('Sea Game', 200, 30, function ($font) {
//            $font->file(base_path('public/asset/fonts/Cloud Script-Regular/CloudScript-Regular.otf'));
//            $font->size(50);
//            $font->color('#f4d442');
//            $font->align('center');
//            $font->valign('top');
//            $font->angle(0);
//        });
//
//        $watermark = Image::make(public_path('/asset/images/logo_small.png'));
//        $img->insert($watermark, 'bottom-right', 10, 10);
//
//        $img->save(\Storage::disk('public')->path($path));
//    }
//
//    /**
//     * @param $type
//     * @return string
//     */
//    public function folderName($type){
//        $folder = '';
//        switch ($type){
//            case ModelImage::TYPE['PRODUCT']:
//                $folder = "images/products/";
//                break;
//            case ModelImage::TYPE['PRODUCT_NOTE']:
//                $folder = "images/products-note/";
//                break;
//            case ModelImage::TYPE['PRODUCT_SHORT_CONTENT']:
//                $folder = "images/products-short-content/";
//                break;
//            case ModelImage::TYPE['PRODUCT_DESCRIPTION']:
//                $folder = "images/products-description/";
//                break;
//            case ModelImage::TYPE['CATEGORY']:
//                $folder = "images/categories/";
//                break;
//            default: ;
//        }
//        return $folder;
//
//    }

}
