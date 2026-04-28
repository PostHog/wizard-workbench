<?php

namespace App\Filament\Resources\Subscriptions;

use App\Filament\Resources\Subscriptions\Pages\EditSubscription;
use App\Filament\Resources\Subscriptions\Pages\ListSubscriptions;
use App\Models\Subscription;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SubscriptionResource extends Resource
{
    protected static ?string $model = Subscription::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-circle-stack';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required(),
                TextInput::make('type')
                    ->required()
                    ->maxLength(255),
                TextInput::make('stripe_id')
                    ->required()
                    ->maxLength(255),
                TextInput::make('stripe_status')
                    ->required()
                    ->maxLength(255),
                TextInput::make('stripe_price')
                    ->maxLength(255),
                TextInput::make('quantity'),
                DateTimePicker::make('trial_ends_at'),
                DateTimePicker::make('ends_at'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user_id')->sortable()->searchable(),
                TextColumn::make('type')->sortable()->searchable(),
                TextColumn::make('stripe_id')->sortable()->searchable(),
                TextColumn::make('stripe_status')
                    ->badge()
                    ->sortable()
                    ->colors([
                        'danger' => 'canceled',
                        'success' => 'active',
                        'warning' => 'past_due',
                    ]),
                TextColumn::make('stripe_price')->sortable(),
                TextColumn::make('amount')->sortable(),
                TextColumn::make('quantity')->sortable(),
                TextColumn::make('trial_ends_at')->dateTime(),
                TextColumn::make('ends_at')->dateTime(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSubscriptions::route('/'),
            'edit' => EditSubscription::route('/{record}/edit'),
        ];
    }
}
